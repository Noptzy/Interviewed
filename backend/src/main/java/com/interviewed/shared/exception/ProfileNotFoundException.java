package com.interviewed.shared.exception;

public class ProfileNotFoundException extends RuntimeException {
    public ProfileNotFoundException(Long userId) {
        super("Profile not found for userId=" + userId);
    }
}
