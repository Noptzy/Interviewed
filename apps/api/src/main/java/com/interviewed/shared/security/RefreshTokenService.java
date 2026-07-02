package com.interviewed.shared.security;

import com.interviewed.auth.entity.User;
import com.interviewed.auth.repository.UserRepository;
import com.interviewed.shared.exception.InvalidCredentialsException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final String PREFIX = "refresh:";

    private final StringRedisTemplate redisTemplate;
    private final UserRepository userRepository;

    @Value("${app.jwt.refresh-ttl}")
    private Duration refreshTtl;

    public String issue(User user) {
        String token = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(PREFIX + token, user.getId().toString(), refreshTtl);
        return token;
    }

    public User validate(String token) {
        String userId = redisTemplate.opsForValue().get(PREFIX + token);
        if (userId == null) {
            throw new InvalidCredentialsException();
        }
        return userRepository.findById(Long.valueOf(userId))
            .orElseThrow(InvalidCredentialsException::new);
    }

    public String rotate(String token, User user) {
        revoke(token);
        return issue(user);
    }

    public void revoke(String token) {
        redisTemplate.delete(PREFIX + token);
    }
}
