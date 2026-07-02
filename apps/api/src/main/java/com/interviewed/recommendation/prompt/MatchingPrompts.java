package com.interviewed.recommendation.prompt;

public final class MatchingPrompts {

    private MatchingPrompts() {}

    public static String rankJobsPrompt(String profileSummary, String skills, String jobsJson) {
        return """
            You are a career advisor. Evaluate how well the candidate matches these job listings.

            Candidate Profile:
            Summary: %s
            Skills: %s

            Job Listings (JSON array):
            %s

            For each job, provide an assessment. Return ONLY a JSON array:
            [
              {
                "jobIndex": 0,
                "matchReason": "Why this role suits the candidate",
                "strengths": "What the candidate brings to this role",
                "gaps": "Skills or experience the candidate may lack"
              }
            ]

            Return ONLY the JSON array, no markdown, no explanation.
            """.formatted(profileSummary, skills, jobsJson);
    }
}
