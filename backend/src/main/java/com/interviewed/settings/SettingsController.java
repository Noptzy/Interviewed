package com.interviewed.settings;

import com.interviewed.auth.CurrentUserService;
import com.interviewed.settings.dto.ModelOption;
import com.interviewed.settings.dto.SettingsResponse;
import com.interviewed.settings.dto.UpdateSettingsRequest;
import com.interviewed.shared.web.ApiResponse;
import com.interviewed.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final CurrentUserService currentUserService;
    private final UserSettingsService userSettingsService;

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
        List<ModelOption> models = List.of(
            new ModelOption("openrouter/owl-alpha", "Owl Alpha (Default)"),
            new ModelOption("openai/gpt-4o-mini", "GPT-4o Mini"),
            new ModelOption("anthropic/claude-3.5-sonnet", "Claude 3.5 Sonnet"),
            new ModelOption("google/gemini-2.0-flash", "Gemini 2.0 Flash"),
            new ModelOption("meta-llama/llama-3.3-70b-instruct", "Llama 3.3 70B")
        );
        return ApiResponse.ok(models);
    }
}
