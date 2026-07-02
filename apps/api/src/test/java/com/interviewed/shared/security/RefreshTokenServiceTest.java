package com.interviewed.shared.security;

import com.interviewed.auth.entity.Role;
import com.interviewed.auth.entity.User;
import com.interviewed.auth.repository.UserRepository;
import com.interviewed.shared.exception.InvalidCredentialsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RefreshTokenServiceTest {

    private StringRedisTemplate redisTemplate;
    private ValueOperations<String, String> valueOperations;
    private UserRepository userRepository;
    private RefreshTokenService refreshTokenService;

    @BeforeEach
    void setUp() {
        redisTemplate = mock(StringRedisTemplate.class);
        valueOperations = mock(ValueOperations.class);
        userRepository = mock(UserRepository.class);
        refreshTokenService = new RefreshTokenService(redisTemplate, userRepository);
        ReflectionTestUtils.setField(refreshTokenService, "refreshTtl", Duration.ofDays(7));
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void issueStoresTokenInRedisWithTtl() {
        User user = user();

        String token = refreshTokenService.issue(user);

        assertThat(token).isNotBlank();
        verify(valueOperations).set(eq("refresh:" + token), eq("9"), eq(Duration.ofDays(7)));
    }

    @Test
    void validateReturnsUserFromStoredToken() {
        when(valueOperations.get("refresh:token")).thenReturn("9");
        when(userRepository.findById(9L)).thenReturn(Optional.of(user()));

        User user = refreshTokenService.validate("token");

        assertThat(user.getEmail()).isEqualTo("user@gmail.com");
    }

    @Test
    void validateRejectsMissingToken() {
        when(valueOperations.get("refresh:missing")).thenReturn(null);

        assertThatThrownBy(() -> refreshTokenService.validate("missing"))
            .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void rotateRevokesOldTokenAndIssuesNewToken() {
        User user = user();

        String token = refreshTokenService.rotate("old", user);

        verify(redisTemplate).delete("refresh:old");
        verify(valueOperations).set(eq("refresh:" + token), eq("9"), any(Duration.class));
    }

    private User user() {
        return User.builder()
            .id(9L)
            .email("user@gmail.com")
            .name("User")
            .passwordHash("hash")
            .role(Role.USER)
            .build();
    }
}
