package com.interviewed.profile.dto;

import com.interviewed.profile.entity.CandidateProfile;

public record ProfileResponse(
    Long id,
    String linkedinUrl,
    String summary,
    String skillsJson,
    String experiencesJson,
    String projectsJson,
    boolean isCompleted
) {
    public static ProfileResponse from(CandidateProfile p) {
        return new ProfileResponse(
            p.getId(),
            p.getLinkedinUrl(),
            p.getSummary(),
            p.getSkillsJson(),
            p.getExperiencesJson(),
            p.getProjectsJson(),
            Boolean.TRUE.equals(p.getIsCompleted())
        );
    }
}
