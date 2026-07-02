package com.interviewed.admin.service;

import com.interviewed.admin.dto.GlobalSettingsResponse;
import com.interviewed.settings.dto.ModelOption;
import com.interviewed.settings.dto.UpdateSettingsRequest;
import com.interviewed.settings.entity.AiModelOption;
import com.interviewed.settings.entity.GlobalAiSettings;
import com.interviewed.settings.repository.AiModelOptionRepository;
import com.interviewed.settings.repository.GlobalAiSettingsRepository;
import com.interviewed.settings.service.OpenRouterModelClient;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminSettingsService {

    private static final Logger log = LoggerFactory.getLogger(AdminSettingsService.class);

    private final GlobalAiSettingsRepository globalAiSettingsRepository;
    private final AiModelOptionRepository aiModelOptionRepository;
    private final OpenRouterModelClient openRouterModelClient;

    public GlobalSettingsResponse getGlobalSettings() {
        GlobalAiSettings settings = getOrCreateGlobalSettings();
        return new GlobalSettingsResponse(settings.getModel(), settings.getTemperature(), settings.getSystemPrompt());
    }

    public GlobalSettingsResponse updateGlobalSettings(UpdateSettingsRequest request) {
        GlobalAiSettings settings = getOrCreateGlobalSettings();
        if (request.model() != null) {
            settings.setModel(request.model());
        }
        if (request.temperature() != null) {
            settings.setTemperature(request.temperature());
        }
        if (request.systemPrompt() != null) {
            settings.setSystemPrompt(request.systemPrompt());
        }
        GlobalAiSettings saved = globalAiSettingsRepository.save(settings);
        log.info("admin.settings.update model={}", saved.getModel());
        return new GlobalSettingsResponse(saved.getModel(), saved.getTemperature(), saved.getSystemPrompt());
    }

    public List<ModelOption> getModels() {
        return aiModelOptionRepository.findAll().stream()
            .map(ModelOption::from)
            .toList();
    }

    public List<ModelOption> getAvailableModels() {
        return openRouterModelClient.getAvailableModels();
    }

    public ModelOption createModel(ModelOption request) {
        AiModelOption saved = aiModelOptionRepository.save(AiModelOption.builder()
            .id(request.id())
            .label(request.label())
            .build());
        log.info("admin.model.create id={}", saved.getId());
        return ModelOption.from(saved);
    }

    public void deleteModel(String id) {
        aiModelOptionRepository.deleteById(id);
        log.info("admin.model.delete id={}", id);
    }

    private GlobalAiSettings getOrCreateGlobalSettings() {
        return globalAiSettingsRepository.findAll().stream()
            .findFirst()
            .orElseGet(() -> globalAiSettingsRepository.save(GlobalAiSettings.builder()
                .model("openai/gpt-oss-20b:free")
                .temperature(0.4)
                .systemPrompt("You are a professional recruiter conducting a structured interview. This is a simulation to help the candidate prepare.\n\nCandidate Profile:\nSummary: {{SUMMARY}}\nSkills: {{SKILLS}}\n\nYour role:\n- Ask focused, relevant questions about the candidate's experience and skills\n- Be professional and friendly\n- Dig deeper when answers are interesting\n- Conduct 3-8 turns total\n- Write every question in Bahasa Indonesia (formal, professional tone)\n\nIMPORTANT: You must respond ONLY with a JSON object in this exact format:\n{\"question\": \"Pertanyaan Anda di sini\", \"complete\": false}\n\nWhen you have gathered sufficient information (minimum 3 turns), set complete to true:\n{\"question\": \"Terima kasih atas waktu Anda. Saya sudah mendapatkan semua informasi yang diperlukan.\", \"complete\": true}\n\nNever claim hiring authority. Always frame this as a simulation.")
                .build()));
    }
}
