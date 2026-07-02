package com.interviewed.apify.service;

import com.interviewed.apify.dto.ApifyJobItem;
import com.interviewed.apify.dto.JobListing;
import org.springframework.stereotype.Component;

@Component
public class ApifyJobMapper {

    public JobListing toJobListing(ApifyJobItem item) {
        return new JobListing(
            item.title(),
            item.companyName(),
            item.location(),
            item.descriptionText(),
            item.link()
        );
    }
}
