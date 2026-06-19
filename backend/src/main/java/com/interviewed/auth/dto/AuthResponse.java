package com.interviewed.auth.dto;

import com.interviewed.user.User;

public record AuthResponse(Long id, String email, String name) {
    public static AuthResponse from(User user) {
        return new AuthResponse(user.getId(), user.getEmail(), user.getName());
    }
}
