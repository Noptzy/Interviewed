package com.interviewed.interview.dto;

import jakarta.validation.constraints.NotBlank;

public record AnswerRequest(@NotBlank String text) {}
