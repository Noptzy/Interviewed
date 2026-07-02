package com.interviewed.auth.service;

import com.interviewed.auth.dto.AuthResponse;
import com.interviewed.auth.dto.LoginRequest;
import com.interviewed.auth.dto.RegisterRequest;
import com.interviewed.auth.entity.Role;
import com.interviewed.shared.exception.EmailAlreadyRegisteredException;
import com.interviewed.shared.exception.InvalidCredentialsException;
import com.interviewed.auth.entity.User;
import com.interviewed.auth.repository.UserRepository;
import com.interviewed.shared.security.AppUserDetails;
import com.interviewed.shared.security.JwtService;
import com.interviewed.shared.security.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyRegisteredException(request.email());
        }
        User user = User.builder()
            .email(request.email())
            .passwordHash(passwordEncoder.encode(request.password()))
            .name(request.name())
            .role(Role.USER)
            .build();
        User saved = userRepository.save(user);
        log.info("auth.register userId={}", saved.getId());
        return withTokens(saved);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
            AppUserDetails details = (AppUserDetails) auth.getPrincipal();
            log.info("auth.login userId={} success=true", details.getUser().getId());
            return withTokens(details.getUser());
        } catch (BadCredentialsException ex) {
            log.warn("auth.login success=false");
            throw new InvalidCredentialsException();
        }
    }

    public AuthResponse refresh(String refreshToken) {
        User user = refreshTokenService.validate(refreshToken);
        String rotated = refreshTokenService.rotate(refreshToken, user);
        String accessToken = jwtService.createAccessToken(user);
        log.info("auth.refresh userId={}", user.getId());
        return AuthResponse.from(user, accessToken, rotated);
    }

    public void logout(String refreshToken) {
        refreshTokenService.revoke(refreshToken);
        log.info("auth.logout");
    }

    private AuthResponse withTokens(User user) {
        return AuthResponse.from(user, jwtService.createAccessToken(user), refreshTokenService.issue(user));
    }
}
