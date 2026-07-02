package com.interviewed.admin.dto;

import com.interviewed.auth.entity.User;

public record AdminUserResponse(Long id, String email, String name, String role) {
    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(user.getId(), user.getEmail(), user.getName(), user.getRole().name());
    }
}
