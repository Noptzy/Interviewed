package com.interviewed.admin.controller;

import com.interviewed.admin.dto.AdminUserResponse;
import com.interviewed.admin.dto.CreateUserRequest;
import com.interviewed.admin.dto.UpdateUserRequest;
import com.interviewed.admin.service.AdminUserService;
import com.interviewed.shared.web.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ApiResponse<List<AdminUserResponse>> findAll() {
        return ApiResponse.ok(adminUserService.findAll());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdminUserResponse> create(@Valid @RequestBody CreateUserRequest request) {
        return ApiResponse.ok(adminUserService.create(request));
    }

    @PutMapping("/{userId}")
    public ApiResponse<AdminUserResponse> update(@PathVariable Long userId, @RequestBody UpdateUserRequest request) {
        return ApiResponse.ok(adminUserService.update(userId, request));
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<Void> delete(@PathVariable Long userId) {
        adminUserService.delete(userId);
        return ApiResponse.ok(null);
    }
}
