package com.interviewed.admin.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewed.admin.dto.InterestStat;
import com.interviewed.auth.repository.UserRepository;
import com.interviewed.interview.repository.InterviewSessionRepository;
import com.interviewed.profile.entity.CandidateProfile;
import com.interviewed.profile.repository.CandidateProfileRepository;
import com.interviewed.recommendation.repository.RecommendationRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AdminAnalyticsServiceTest {

    @Test
    void interestStatsAggregatesNormalizedSkillsDescending() {
        CandidateProfileRepository repository = mock(CandidateProfileRepository.class);
        AdminAnalyticsService service = new AdminAnalyticsService(
            repository,
            mock(UserRepository.class),
            mock(InterviewSessionRepository.class),
            mock(RecommendationRepository.class),
            new ObjectMapper()
        );
        when(repository.findAll()).thenReturn(List.of(
            profile("[\"Java\",\"Spring Boot\",\"react\"]"),
            profile("[\"java\",\"React\",\"SQL\"]"),
            profile("not-json")
        ));

        List<InterestStat> stats = service.interestStats();

        assertThat(stats).extracting(InterestStat::skill)
            .containsExactly("Java", "React", "Spring boot", "Sql");
        assertThat(stats).extracting(InterestStat::count)
            .containsExactly(2L, 2L, 1L, 1L);
    }

    private CandidateProfile profile(String skillsJson) {
        return CandidateProfile.builder()
            .userId(1L)
            .skillsJson(skillsJson)
            .isCompleted(true)
            .build();
    }
}
