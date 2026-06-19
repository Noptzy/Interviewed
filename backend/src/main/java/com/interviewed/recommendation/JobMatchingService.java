package com.interviewed.recommendation;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewed.ai.ChatClientFactory;
import com.interviewed.apify.dto.JobListing;
import com.interviewed.profile.CandidateProfile;
import com.interviewed.recommendation.prompt.MatchingPrompts;
import com.interviewed.shared.exception.RecommendationGenerationException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JobMatchingService {

    private static final Logger log = LoggerFactory.getLogger(JobMatchingService.class);

    private final ChatClientFactory chatClientFactory;
    private final ObjectMapper objectMapper;

    public List<RankedJob> rankAgainstProfile(Long userId, CandidateProfile profile, List<JobListing> jobs) {
        if (jobs.isEmpty()) return List.of();

        try {
            String jobsJson = objectMapper.writeValueAsString(jobs);
            String prompt = MatchingPrompts.rankJobsPrompt(profile.getSummary(), profile.getSkillsJson(), jobsJson);

            log.info("ai.matching userId={} jobCount={}", userId, jobs.size());

            String raw = chatClientFactory.forUser(userId).prompt().user(prompt).call().content();
            String cleaned = raw.strip();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replaceAll("^```[a-z]*\\n?", "").replaceAll("```$", "").strip();
            }

            List<Map<String, Object>> rankings = objectMapper.readValue(cleaned, new TypeReference<>() {});
            return rankings.stream().map(r -> {
                int idx = ((Number) r.getOrDefault("jobIndex", 0)).intValue();
                JobListing job = idx < jobs.size() ? jobs.get(idx) : jobs.get(0);
                return new RankedJob(
                    job,
                    (String) r.getOrDefault("matchReason", "Good match"),
                    (String) r.getOrDefault("strengths", ""),
                    (String) r.getOrDefault("gaps", "")
                );
            }).toList();

        } catch (Exception ex) {
            log.error("ai.matching.error userId={}", userId);
            return jobs.stream().map(j -> new RankedJob(j, "Potential match based on your profile", "", "")).toList();
        }
    }

    public record RankedJob(JobListing job, String matchReason, String strengths, String gaps) {}
}
