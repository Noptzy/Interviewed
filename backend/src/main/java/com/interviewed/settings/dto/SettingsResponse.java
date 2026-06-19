package com.interviewed.settings.dto;

import com.interviewed.settings.UserSettings;

public record SettingsResponse(Long userId, String model, Double temperature) {
    public static SettingsResponse from(UserSettings s) {
        return new SettingsResponse(s.getUserId(), s.getOpenrouterModel(), s.getTemperature());
    }
}
