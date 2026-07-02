package com.interviewed.admin.dto;

import java.util.List;

public record OverviewStats(
    long totalUsers,
    long totalAdmins,
    long totalSessions,
    long completedSessions,
    long totalRecommendations,
    long completedProfiles,
    long totalProfiles,
    List<DailyCount> signups,
    List<DailyCount> sessions
) {
    public record DailyCount(String date, long count) {
    }
}
