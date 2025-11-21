package com.nullpointer.domain.auth.service.impl;

import com.nullpointer.domain.auth.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    // String {key(token) : value(userId)}
    private final StringRedisTemplate stringRedisTemplate;

    private static final String PREFIX = "refresh:";

    @Value("${app.jwt.refresh-expiration}")
    private long refreshTokenExpirationMillis; // 유효 시간


    // RefreshToken 저장
    @Override
    public void saveRefreshToken(Long userId, String refreshToken) {
        String key = PREFIX + refreshToken;

        stringRedisTemplate.opsForValue().set(
                key,
                String.valueOf(userId),
                refreshTokenExpirationMillis,
                TimeUnit.MILLISECONDS
        );
    }

    // userId 조회
    @Override
    public Long getUserIdByRefreshToken(String refreshToken) {
        String key = PREFIX + refreshToken;
        String value = stringRedisTemplate.opsForValue().get(key);

        return value != null ? Long.valueOf(value) : null;
    }

    @Override
    public void deleteRefreshToken(String refreshToken) {
        String key = PREFIX + refreshToken;
        stringRedisTemplate.delete(key);
    }
}
