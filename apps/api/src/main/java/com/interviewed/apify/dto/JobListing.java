package com.interviewed.apify.dto;

public record JobListing(
    String title,
    String company,
    String location,
    String description,
    String applyUrl
) {}
