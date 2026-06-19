package com.interviewed.auth.dto;

import com.interviewed.user.User;

public record CurrentUserResponse(Long id, String email, String name, boolean isProfileCompleted) {
    public static CurrentUserResponse from(User user, boolean isProfileCompleted) {
        return new CurrentUserResponse(user.getId(), user.getEmail(), user.getName(), isProfileCompleted);
    }
}
