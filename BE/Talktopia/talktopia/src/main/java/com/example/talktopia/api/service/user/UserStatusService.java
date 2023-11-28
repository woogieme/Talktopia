package com.example.talktopia.api.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserStatusService {

    private final String HASH_NAME = "useStatus"; // Redis Hash 이름

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void updateUserStatus(String userId, String status) {
        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
        hashOperations.put(HASH_NAME, userId, status);
    }

    public String getUserStatus(String userId) {
        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
        return hashOperations.get(HASH_NAME, userId);
    }
}