package com.interviewed.admin.dto;

import com.interviewed.auth.entity.Role;

public record UpdateUserRequest(String email, String name, String password, Role role) {}
