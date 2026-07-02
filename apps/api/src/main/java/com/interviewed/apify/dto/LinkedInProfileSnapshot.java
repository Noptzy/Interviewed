package com.interviewed.apify.dto;

import java.util.List;

public record LinkedInProfileSnapshot(
    String fullName,
    String headline,
    String summary,
    String location,
    List<String> skills
) {}
