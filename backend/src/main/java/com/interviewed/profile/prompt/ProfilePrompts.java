package com.interviewed.profile.prompt;

public final class ProfilePrompts {

    private ProfilePrompts() {}

    public static String analyzePrompt(String cvText, String linkedinSnapshot) {
        return """
            You are an expert talent analyst. Analyze the following candidate information and extract a structured profile.

            CV Content:
            %s

            LinkedIn Data:
            %s

            Return ONLY a JSON object with this exact structure:
            {
              "summary": "2-3 sentence professional summary",
              "skills": ["skill1", "skill2", "skill3"],
              "experiences": [
                {
                  "title": "Job Title",
                  "company": "Company Name",
                  "duration": "2021-2023",
                  "description": "Brief description"
                }
              ],
              "projects": [
                {
                  "name": "Project Name",
                  "description": "Brief description",
                  "technologies": ["tech1", "tech2"]
                }
              ]
            }

            Return ONLY the JSON object, no markdown, no explanation.
            """.formatted(cvText, linkedinSnapshot);
    }
}
