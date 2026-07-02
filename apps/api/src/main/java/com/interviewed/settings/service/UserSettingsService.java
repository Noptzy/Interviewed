package com.interviewed.settings.service;

import com.interviewed.settings.dto.SettingsResponse;
import com.interviewed.settings.dto.UpdateSettingsRequest;
import com.interviewed.settings.entity.UserSettings;
import com.interviewed.settings.repository.GlobalAiSettingsRepository;
import com.interviewed.settings.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserSettingsService {

    private static final Logger log = LoggerFactory.getLogger(UserSettingsService.class);

    private final UserSettingsRepository userSettingsRepository;
    private final GlobalAiSettingsRepository globalAiSettingsRepository;

    public UserSettings getOrDefault(Long userId) {
        return userSettingsRepository.findByUserId(userId)
            .orElseGet(() -> {
                UserSettings settings = UserSettings.builder().userId(userId).build();
                globalAiSettingsRepository.findAll().stream().findFirst().ifPresent(global -> {
                    settings.setOpenrouterModel(global.getModel());
                    settings.setTemperature(global.getTemperature());
                });
                return settings;
            });
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
