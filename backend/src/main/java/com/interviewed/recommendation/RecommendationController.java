package com.interviewed.recommendation;

import com.interviewed.auth.CurrentUserService;
import com.interviewed.recommendation.dto.RecommendationResponse;
import com.interviewed.shared.web.ApiResponse;
import com.interviewed.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final CurrentUserService currentUserService;
    private final RecommendationService recommendationService;

    @PostMapping("/generate")
    public ApiResponse<List<RecommendationResponse>> generate() {
        User user = currentUserService.requireCurrentUser();
        return ApiResponse.ok(recommendationService.generateRecommendations(user.getId()));
    }

    @GetMapping
    public ApiResponse<List<RecommendationResponse>> list() {
        User user = currentUserService.requireCurrentUser();
        return ApiResponse.ok(recommendationService.listRecommendations(user.getId()));
    }
}
