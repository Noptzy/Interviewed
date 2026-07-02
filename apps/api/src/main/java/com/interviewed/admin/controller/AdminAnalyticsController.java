package com.interviewed.admin.controller;

import com.interviewed.admin.dto.InterestStat;
import com.interviewed.admin.dto.OverviewStats;
import com.interviewed.admin.service.AdminAnalyticsService;
import com.interviewed.shared.web.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final AdminAnalyticsService adminAnalyticsService;

    @GetMapping("/overview")
    public ApiResponse<OverviewStats> overview() {
        return ApiResponse.ok(adminAnalyticsService.overview());
    }

    @GetMapping("/interests")
    public ApiResponse<List<InterestStat>> interests() {
        return ApiResponse.ok(adminAnalyticsService.interestStats());
    }
}
