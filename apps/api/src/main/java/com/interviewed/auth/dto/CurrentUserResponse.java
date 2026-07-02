package com.interviewed.auth.dto;

import com.interviewed.auth.entity.User;

public record CurrentUserResponse(Long id, String email, String name, String role, boolean isProfileCompleted) {
    public static CurrentUserResponse from(User user, boolean isProfileCompleted) {
        return new CurrentUserResponse(user.getId(), user.getEmail(), user.getName(), user.getRole().name(), isProfileCompleted);
    }
}
