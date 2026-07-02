package com.interviewed.admin.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewed.admin.dto.InterestStat;
import com.interviewed.admin.dto.OverviewStats;
import com.interviewed.auth.entity.Role;
import com.interviewed.auth.entity.User;
import com.interviewed.auth.repository.UserRepository;
import com.interviewed.interview.entity.InterviewSession;
import com.interviewed.interview.repository.InterviewSessionRepository;
import com.interviewed.profile.repository.CandidateProfileRepository;
import com.interviewed.recommendation.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private static final int OVERVIEW_DAYS = 14;

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;
    private final InterviewSessionRepository interviewSessionRepository;
    private final RecommendationRepository recommendationRepository;
    private final ObjectMapper objectMapper;

    public OverviewStats overview() {
        return new OverviewStats(
            userRepository.count(),
            userRepository.countByRole(Role.ADMIN),
            interviewSessionRepository.count(),
            interviewSessionRepository.countByStatus(InterviewSession.SessionStatus.COMPLETED),
            recommendationRepository.count(),
            candidateProfileRepository.countByIsCompletedTrue(),
            candidateProfileRepository.count(),
            dailyCounts(userRepository.findAll().stream().map(User::getCreatedAt).toList()),
            dailyCounts(interviewSessionRepository.findAll().stream().map(InterviewSession::getStartedAt).toList())
        );
    }

    public List<InterestStat> interestStats() {
        return candidateProfileRepository.findAll().stream()
            .flatMap(profile -> parseSkills(profile.getSkillsJson()).stream())
            .map(this::normalize)
            .filter(skill -> !skill.isBlank())
            .collect(Collectors.groupingBy(skill -> skill, Collectors.counting()))
            .entrySet()
            .stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(12)
            .map(entry -> new InterestStat(entry.getKey(), entry.getValue()))
            .toList();
    }

    private List<OverviewStats.DailyCount> dailyCounts(List<LocalDateTime> timestamps) {
        LocalDate startDate = LocalDate.now().minusDays(OVERVIEW_DAYS - 1L);
        Map<LocalDate, Long> countsByDate = timestamps.stream()
            .filter(timestamp -> timestamp != null && !timestamp.toLocalDate().isBefore(startDate))
            .collect(Collectors.groupingBy(timestamp -> timestamp.toLocalDate(), Collectors.counting()));
        return java.util.stream.Stream.iterate(startDate, date -> date.plusDays(1))
            .limit(OVERVIEW_DAYS)
            .map(date -> new OverviewStats.DailyCount(date.toString(), countsByDate.getOrDefault(date, 0L)))
            .toList();
    }

    private List<String> parseSkills(String skillsJson) {
        if (skillsJson == null || skillsJson.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(skillsJson, new TypeReference<>() {});
        } catch (Exception ex) {
            return List.of();
        }
    }

    private String normalize(String skill) {
        String value = skill.trim().toLowerCase(Locale.ROOT);
        if (value.isBlank()) {
            return value;
        }
        return value.substring(0, 1).toUpperCase(Locale.ROOT) + value.substring(1);
    }
}
