package com.interviewed.admin.dto;

import com.interviewed.auth.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateUserRequest(
    @Email @NotBlank String email,
    @NotBlank String name,
    @NotBlank String password,
    @NotNull Role role
) {}
