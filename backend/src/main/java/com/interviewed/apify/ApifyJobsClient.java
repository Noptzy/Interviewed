package com.interviewed.apify;

import com.interviewed.apify.dto.ApifyJobItem;
import com.interviewed.apify.dto.JobListing;
import com.interviewed.shared.exception.ExternalServiceException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ApifyJobsClient {

    private static final Logger log = LoggerFactory.getLogger(ApifyJobsClient.class);

    private final RestClient apifyRestClient;
    private final ApifyJobMapper apifyJobMapper;

    @Value("${app.apify.token:}")
    private String apifyToken;

    @Value("${app.apify.actor:curious_coder~linkedin-jobs-scraper}")
    private String actor;

    public List<JobListing> retrieveLinkedInJobs(String keywords, String location) {
        log.info("apify.jobs.fetch keywords={} location={}", keywords, location);
        try {
            String searchUrl = "https://www.linkedin.com/jobs/search/?keywords="
                + UriUtils.encodeQueryParam(keywords, StandardCharsets.UTF_8)
                + "&location=" + UriUtils.encodeQueryParam(location, StandardCharsets.UTF_8);
            String url = "https://api.apify.com/v2/acts/" + actor + "/run-sync-get-dataset-items?token=" + apifyToken;
            List<ApifyJobItem> items = apifyRestClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .body(Map.of("urls", List.of(searchUrl), "count", 10, "scrapeCompany", false))
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
            if (items == null) return List.of();
            return items.stream().map(apifyJobMapper::toJobListing).toList();
        } catch (Exception ex) {
            log.error("apify.jobs.error actor={} cause={}", actor, ex.getMessage());
            throw new ExternalServiceException("Apify", "Failed to retrieve job listings", ex);
        }
    }
}
