package com.interviewed.settings;

import com.interviewed.settings.dto.SettingsResponse;
import com.interviewed.settings.dto.UpdateSettingsRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserSettingsService {

    private static final Logger log = LoggerFactory.getLogger(UserSettingsService.class);

    private final UserSettingsRepository userSettingsRepository;

    public UserSettings getOrDefault(Long userId) {
        return userSettingsRepository.findByUserId(userId)
            .orElseGet(() -> UserSettings.builder().userId(userId).build());
    }

    public SettingsResponse updateSettings(Long userId, UpdateSettingsRequest request) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
            .orElseGet(() -> UserSettings.builder().userId(userId).build());
        settings.setOpenrouterModel(request.model());
        settings.setTemperature(request.temperature());
        UserSettings saved = userSettingsRepository.save(settings);
        log.info("settings.update userId={} model={}", userId, request.model());
        return SettingsResponse.from(saved);
    }
}
