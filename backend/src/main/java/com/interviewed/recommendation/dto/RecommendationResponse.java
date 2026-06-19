package com.interviewed.recommendation.dto;

import com.interviewed.recommendation.Recommendation;

public record RecommendationResponse(
    Long id,
    String jobTitle,
    String company,
    String location,
    String applyUrl,
    String matchReason,
    String strengths,
    String gaps
) {
    public static RecommendationResponse from(Recommendation r) {
        return new RecommendationResponse(
            r.getId(), r.getJobTitle(), r.getCompany(), r.getLocation(),
            r.getApplyUrl(), r.getMatchReason(), r.getStrengths(), r.getGaps()
        );
    }
}
