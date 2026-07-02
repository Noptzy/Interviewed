package com.interviewed.profile.controller;

import com.interviewed.auth.service.CurrentUserService;
import com.interviewed.profile.dto.AnalyzeProfileRequest;
import com.interviewed.profile.dto.ProfileResponse;
import com.interviewed.profile.entity.CandidateProfile;
import com.interviewed.profile.repository.CandidateProfileRepository;
import com.interviewed.profile.service.ProfileAnalysisService;
import com.interviewed.shared.exception.ProfileNotFoundException;
import com.interviewed.shared.web.ApiResponse;
import com.interviewed.auth.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final CurrentUserService currentUserService;
    private final ProfileAnalysisService profileAnalysisService;
    private final CandidateProfileRepository candidateProfileRepository;

    @GetMapping
    public ApiResponse<ProfileResponse> getProfile() {
        User user = currentUserService.requireCurrentUser();
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ProfileNotFoundException(user.getId()));
        return ApiResponse.ok(ProfileResponse.from(profile));
    }

    @PostMapping("/linkedin")
    public ApiResponse<Void> saveLinkedinUrl(@RequestBody java.util.Map<String, String> body) {
        User user = currentUserService.requireCurrentUser();
        String url = body.get("url");
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
            .orElseGet(() -> CandidateProfile.builder().userId(user.getId()).isCompleted(false).build());
        profile.setLinkedinUrl(url);
        candidateProfileRepository.save(profile);
        return ApiResponse.ok(null);
    }

    @PostMapping("/analyze")
    public ApiResponse<ProfileResponse> analyzeProfile(@RequestBody AnalyzeProfileRequest request) {
        User user = currentUserService.requireCurrentUser();
        return ApiResponse.ok(profileAnalysisService.analyzeCandidateProfile(user.getId(), request.cvText(), request.linkedinUrl()));
    }
}
