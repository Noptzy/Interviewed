package com.interviewed.auth.dto;

import com.interviewed.auth.entity.User;

public record AuthResponse(Long id, String email, String name, String role, String accessToken, String refreshToken) {
    public static AuthResponse from(User user, String accessToken, String refreshToken) {
        return new AuthResponse(user.getId(), user.getEmail(), user.getName(), user.getRole().name(), accessToken, refreshToken);
    }
}
