package com.interviewed.recommendation.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewed.profile.entity.CandidateProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JobQueryBuilder {

    private final ObjectMapper objectMapper;

    public String buildKeywords(CandidateProfile profile) {
        try {
            List<String> skills = objectMapper.readValue(
                profile.getSkillsJson() != null ? profile.getSkillsJson() : "[]",
                new TypeReference<>() {}
            );
            List<String> top3 = skills.stream().limit(3).toList();
            return String.join(", ", top3);
        } catch (Exception ex) {
            return profile.getSummary() != null ? profile.getSummary().substring(0, Math.min(50, profile.getSummary().length())) : "software engineer";
        }
    }

    public String buildLocation(CandidateProfile profile) {
        try {
            List<Map<String, Object>> experiences = objectMapper.readValue(
                profile.getExperiencesJson() != null ? profile.getExperiencesJson() : "[]",
                new TypeReference<>() {}
            );
            if (!experiences.isEmpty()) {
                Object loc = experiences.get(0).get("location");
                if (loc instanceof String s && !s.isBlank()) return s;
            }
        } catch (Exception ignored) {}
        return "Remote";
    }
}
