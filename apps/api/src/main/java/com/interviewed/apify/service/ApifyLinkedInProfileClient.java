package com.interviewed.apify.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.interviewed.apify.dto.LinkedInProfileSnapshot;
import com.interviewed.shared.exception.ExternalServiceException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ApifyLinkedInProfileClient {

    private static final Logger log = LoggerFactory.getLogger(ApifyLinkedInProfileClient.class);

    private final RestClient apifyRestClient;

    @Value("${app.apify.token:}")
    private String apifyToken;

    @Value("${app.apify.linkedin-profile-actor:apimaestro~linkedin-profile-detail}")
    private String actor;

    public LinkedInProfileSnapshot fetchProfile(String profileUrl) {
        log.info("apify.linkedin.fetch");
        try {
            String url = "https://api.apify.com/v2/acts/" + actor + "/run-sync-get-dataset-items?token=" + apifyToken;
            List<RawProfile> items = apifyRestClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .body(Map.of("profileUrls", List.of(profileUrl)))
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
            if (items == null || items.isEmpty()) {
                return new LinkedInProfileSnapshot(null, null, null, null, List.of());
            }
            RawProfile raw = items.get(0);
            return new LinkedInProfileSnapshot(raw.fullName(), raw.headline(), raw.summary(), raw.location(), raw.skills() != null ? raw.skills() : List.of());
        } catch (Exception ex) {
            log.warn("apify.linkedin.error, using empty snapshot");
            return new LinkedInProfileSnapshot(null, null, null, null, List.of());
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record RawProfile(String fullName, String headline, String summary, String location, List<String> skills) {}
}
