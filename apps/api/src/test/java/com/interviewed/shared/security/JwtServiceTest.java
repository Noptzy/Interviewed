package com.interviewed.shared.security;

import com.interviewed.auth.entity.Role;
import com.interviewed.auth.entity.User;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    @Test
    void createAccessTokenCanBeParsedToUserClaims() {
        JwtService jwtService = new JwtService("test-secret-key-that-is-long-enough-32", Duration.ofMinutes(15));
        User user = User.builder()
            .id(7L)
            .email("admin@gmail.com")
            .name("Admin")
            .passwordHash("hash")
            .role(Role.ADMIN)
            .build();

        User parsed = jwtService.parseUser(jwtService.createAccessToken(user));

        assertThat(parsed.getId()).isEqualTo(7L);
        assertThat(parsed.getEmail()).isEqualTo("admin@gmail.com");
        assertThat(parsed.getRole()).isEqualTo(Role.ADMIN);
    }
}
