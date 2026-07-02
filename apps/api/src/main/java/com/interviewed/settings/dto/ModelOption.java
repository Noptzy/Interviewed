package com.interviewed.settings.dto;

import com.interviewed.settings.entity.AiModelOption;

public record ModelOption(String id, String label) {
    public static ModelOption from(AiModelOption option) {
        return new ModelOption(option.getId(), option.getLabel());
    }
}
