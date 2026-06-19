package com.interviewed.profile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewed.ai.ChatClientFactory;
import com.interviewed.apify.ApifyLinkedInProfileClient;
import com.interviewed.apify.dto.LinkedInProfileSnapshot;
import com.interviewed.profile.dto.ProfileResponse;
import com.interviewed.profile.prompt.ProfilePrompts;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProfileAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(ProfileAnalysisService.class);

    private final ChatClientFactory chatClientFactory;
    private final CandidateProfileRepository candidateProfileRepository;
    private final ApifyLinkedInProfileClient linkedInProfileClient;
    private final ObjectMapper objectMapper;

    public ProfileResponse analyzeCandidateProfile(Long userId, String cvText, String linkedinUrl) {
        String linkedinSnapshot = "{}";
        if (linkedinUrl != null && !linkedinUrl.isBlank()) {
            LinkedInProfileSnapshot snapshot = linkedInProfileClient.fetchProfile(linkedinUrl);
            try {
                linkedinSnapshot = objectMapper.writeValueAsString(snapshot);
            } catch (Exception ignored) {}
        }

        String prompt = ProfilePrompts.analyzePrompt(cvText != null ? cvText : "", linkedinSnapshot);

        log.info("ai.profile.analyze userId={}", userId);
        String raw = chatClientFactory.forUser(userId)
            .prompt()
            .user(prompt)
            .call()
            .content();

        String cleanedRaw = cleanJson(raw);

        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
            .orElseGet(() -> CandidateProfile.builder().userId(userId).build());

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> parsed = objectMapper.readValue(cleanedRaw, Map.class);
            profile.setSummary((String) parsed.get("summary"));
            profile.setSkillsJson(objectMapper.writeValueAsString(parsed.get("skills")));
            profile.setExperiencesJson(objectMapper.writeValueAsString(parsed.get("experiences")));
            profile.setProjectsJson(objectMapper.writeValueAsString(parsed.get("projects")));
        } catch (Exception ex) {
            log.error("ai.profile.parse.error");
            profile.setSummary(cleanedRaw);
        }

        if (linkedinUrl != null && !linkedinUrl.isBlank()) {
            profile.setLinkedinUrl(linkedinUrl);
        }
        profile.setIsCompleted(true);

        return ProfileResponse.from(candidateProfileRepository.save(profile));
    }

    private String cleanJson(String raw) {
        if (raw == null) return "{}";
        String trimmed = raw.strip();
        if (trimmed.startsWith("```")) {
            trimmed = trimmed.replaceAll("^```[a-z]*\\n?", "").replaceAll("```$", "").strip();
        }
        return trimmed;
    }
}
