package com.interviewed.admin.controller;

import com.interviewed.admin.dto.GlobalSettingsResponse;
import com.interviewed.admin.service.AdminSettingsService;
import com.interviewed.settings.dto.ModelOption;
import com.interviewed.settings.dto.UpdateSettingsRequest;
import com.interviewed.shared.web.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class AdminSettingsController {

    private final AdminSettingsService adminSettingsService;

    @GetMapping
    public ApiResponse<GlobalSettingsResponse> getSettings() {
        return ApiResponse.ok(adminSettingsService.getGlobalSettings());
    }

    @PutMapping
    public ApiResponse<GlobalSettingsResponse> updateSettings(@RequestBody UpdateSettingsRequest request) {
        return ApiResponse.ok(adminSettingsService.updateGlobalSettings(request));
    }

    @GetMapping("/models")
    public ApiResponse<List<ModelOption>> getModels() {
        return ApiResponse.ok(adminSettingsService.getModels());
    }

    @GetMapping("/models/available")
    public ApiResponse<List<ModelOption>> getAvailableModels() {
        return ApiResponse.ok(adminSettingsService.getAvailableModels());
    }

    @PostMapping("/models")
    public ApiResponse<ModelOption> createModel(@RequestBody ModelOption request) {
        return ApiResponse.ok(adminSettingsService.createModel(request));
    }

    @DeleteMapping("/models")
    public ApiResponse<Void> deleteModel(@RequestParam String id) {
        adminSettingsService.deleteModel(id);
        return ApiResponse.ok(null);
    }
}
