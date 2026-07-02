package com.interviewed.recommendation.service;

import com.interviewed.apify.service.ApifyJobsClient;
import com.interviewed.apify.dto.JobListing;
import com.interviewed.profile.entity.CandidateProfile;
import com.interviewed.profile.repository.CandidateProfileRepository;
import com.interviewed.recommendation.dto.RecommendationResponse;
import com.interviewed.recommendation.entity.Recommendation;
import com.interviewed.recommendation.repository.RecommendationRepository;
import com.interviewed.shared.exception.ProfileNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);

    private final ApifyJobsClient apifyJobsClient;
    private final RecommendationRepository recommendationRepository;
    private final JobMatchingService jobMatchingService;
    private final CandidateProfileRepository candidateProfileRepository;
    private final JobQueryBuilder jobQueryBuilder;

    @Transactional
    public List<RecommendationResponse> generateRecommendations(Long userId) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ProfileNotFoundException(userId));

        String keywords = jobQueryBuilder.buildKeywords(profile);
        String location = jobQueryBuilder.buildLocation(profile);

        log.info("recommendation.generate userId={} keywords={}", userId, keywords);

        List<JobListing> jobs = apifyJobsClient.retrieveLinkedInJobs(keywords, location);
        List<JobMatchingService.RankedJob> ranked = jobMatchingService.rankAgainstProfile(userId, profile, jobs);

        recommendationRepository.deleteByUserId(userId);

        List<Recommendation> saved = ranked.stream().map(r -> recommendationRepository.save(
            Recommendation.builder()
                .userId(userId)
                .jobTitle(r.job().title())
                .company(r.job().company())
                .location(r.job().location())
                .applyUrl(r.job().applyUrl())
                .matchReason(r.matchReason())
                .strengths(r.strengths())
                .gaps(r.gaps())
                .source("APIFY")
                .build()
        )).toList();

        return saved.stream().map(RecommendationResponse::from).toList();
    }

    public List<RecommendationResponse> listRecommendations(Long userId) {
        return recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(RecommendationResponse::from).toList();
    }
}
