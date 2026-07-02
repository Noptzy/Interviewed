package com.interviewed.auth.controller;

import com.interviewed.auth.dto.CurrentUserResponse;
import com.interviewed.auth.service.CurrentUserService;
import com.interviewed.profile.repository.CandidateProfileRepository;
import com.interviewed.shared.web.ApiResponse;
import com.interviewed.auth.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final CurrentUserService currentUserService;
    private final CandidateProfileRepository candidateProfileRepository;

    @GetMapping("/me")
    public ApiResponse<CurrentUserResponse> me() {
        User user = currentUserService.requireCurrentUser();
        boolean isProfileCompleted = candidateProfileRepository.findByUserId(user.getId())
            .map(p -> Boolean.TRUE.equals(p.getIsCompleted()))
            .orElse(false);
        return ApiResponse.ok(CurrentUserResponse.from(user, isProfileCompleted));
    }
}
