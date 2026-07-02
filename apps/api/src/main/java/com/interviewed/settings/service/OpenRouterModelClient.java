package com.interviewed.settings.service;

import com.interviewed.settings.dto.ModelOption;
import com.interviewed.shared.exception.ExternalServiceException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Comparator;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OpenRouterModelClient {

    private static final Logger log = LoggerFactory.getLogger(OpenRouterModelClient.class);

    private final RestClient apifyRestClient;

    @Value("${spring.ai.openai.base-url:https://openrouter.ai/api}")
    private String baseUrl;

    @Value("${spring.ai.openai.api-key:}")
    private String apiKey;

    public List<ModelOption> getAvailableModels() {
        log.info("openrouter.models.fetch");
        try {
            OpenRouterModelsResponse response = apifyRestClient.get()
                .uri(baseUrl + "/v1/models")
                .headers(headers -> {
                    if (apiKey != null && !apiKey.isBlank()) {
                        headers.setBearerAuth(apiKey);
                    }
                })
                .retrieve()
                .body(OpenRouterModelsResponse.class);
            if (response == null || response.data() == null) {
                return List.of();
            }
            return response.data().stream()
                .filter(model -> model.id() != null && !model.id().isBlank())
                .map(model -> new ModelOption(model.id(), model.label()))
                .sorted(Comparator
                    .comparing((ModelOption option) -> !option.id().endsWith(":free"))
                    .thenComparing(option -> option.label().toLowerCase()))
                .toList();
        } catch (Exception ex) {
            log.error("openrouter.models.error cause={}", ex.getMessage());
            throw new ExternalServiceException("OpenRouter", "Failed to retrieve model catalog", ex);
        }
    }

    private record OpenRouterModelsResponse(List<OpenRouterModel> data) {
    }

    private record OpenRouterModel(String id, String name) {
        String label() {
            if (name == null || name.isBlank()) {
                return id;
            }
            return name;
        }
    }
}
