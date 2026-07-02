package com.interviewed.apify.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ApifyJobItem(
    String title,
    String companyName,
    String location,
    String descriptionText,
    String link
) {}
