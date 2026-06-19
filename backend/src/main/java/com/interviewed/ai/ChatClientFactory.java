package com.interviewed.ai;

import com.interviewed.settings.UserSettings;
import com.interviewed.settings.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChatClientFactory {

    private static final Logger log = LoggerFactory.getLogger(ChatClientFactory.class);

    private final OpenAiChatModel chatModel;
    private final UserSettingsRepository userSettingsRepository;

    @Value("${spring.ai.openai.chat.options.model:openai/gpt-4o-mini}")
    private String defaultModel;

    @Value("${spring.ai.openai.chat.options.temperature:0.4}")
    private Double defaultTemperature;

    public ChatClient forUser(Long userId) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
            .orElse(null);
        String model = (settings != null && settings.getOpenrouterModel() != null)
            ? settings.getOpenrouterModel() : defaultModel;
        double temperature = (settings != null && settings.getTemperature() != null)
            ? settings.getTemperature() : defaultTemperature;
        log.info("ai.request userId={} model={}", userId, model);
        OpenAiChatOptions options = OpenAiChatOptions.builder()
            .model(model)
            .temperature(temperature)
            .build();
        return ChatClient.builder(chatModel)
            .defaultOptions(options)
            .build();
    }

    public ChatClient withDefaults() {
        return ChatClient.builder(chatModel).build();
    }
}
