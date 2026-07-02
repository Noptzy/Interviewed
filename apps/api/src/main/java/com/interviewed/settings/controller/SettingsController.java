package com.interviewed.settings.controller;

import com.interviewed.auth.service.CurrentUserService;
import com.interviewed.settings.dto.ModelOption;
import com.interviewed.settings.dto.SettingsResponse;
import com.interviewed.settings.dto.UpdateSettingsRequest;
import com.interviewed.settings.repository.AiModelOptionRepository;
import com.interviewed.settings.service.UserSettingsService;
import com.interviewed.shared.web.ApiResponse;
import com.interviewed.auth.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final CurrentUserService currentUserService;
    private final UserSettingsService userSettingsService;
    private final AiModelOptionRepository aiModelOptionRepository;

    @GetMapping
    public ApiResponse<SettingsResponse> getSettings() {
        User user = currentUserService.requireCurrentUser();
        return ApiResponse.ok(SettingsResponse.from(userSettingsService.getOrDefault(user.getId())));
    }

    @PutMapping
    public ApiResponse<SettingsResponse> updateSettings(@RequestBody UpdateSettingsRequest request) {
        User user = currentUserService.requireCurrentUser();
        return ApiResponse.ok(userSettingsService.updateSettings(user.getId(), request));
    }

    @GetMapping("/models")
    public ApiResponse<List<ModelOption>> getModels() {
        List<ModelOption> models = aiModelOptionRepository.findAll().stream()
            .map(ModelOption::from)
            .toList();
        return ApiResponse.ok(models);
    }
}
