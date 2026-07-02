package com.interviewed.admin.service;

import com.interviewed.admin.dto.AdminUserResponse;
import com.interviewed.admin.dto.CreateUserRequest;
import com.interviewed.admin.dto.UpdateUserRequest;
import com.interviewed.auth.entity.User;
import com.interviewed.auth.repository.UserRepository;
import com.interviewed.shared.exception.EmailAlreadyRegisteredException;
import com.interviewed.shared.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private static final Logger log = LoggerFactory.getLogger(AdminUserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AdminUserResponse> findAll() {
        return userRepository.findAll().stream()
            .map(AdminUserResponse::from)
            .toList();
    }

    public AdminUserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyRegisteredException(request.email());
        }
        User user = User.builder()
            .email(request.email())
            .name(request.name())
            .passwordHash(passwordEncoder.encode(request.password()))
            .role(request.role())
            .build();
        User saved = userRepository.save(user);
        log.info("admin.user.create userId={}", saved.getId());
        return AdminUserResponse.from(saved);
    }

    public AdminUserResponse update(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
        if (request.email() != null && !request.email().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.email())) {
                throw new EmailAlreadyRegisteredException(request.email());
            }
            user.setEmail(request.email());
        }
        if (request.name() != null) {
            user.setName(request.name());
        }
        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }
        if (request.role() != null) {
            user.setRole(request.role());
        }
        User saved = userRepository.save(user);
        log.info("admin.user.update userId={}", saved.getId());
        return AdminUserResponse.from(saved);
    }

    public void delete(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId);
        }
        userRepository.deleteById(userId);
        log.info("admin.user.delete userId={}", userId);
    }
}
