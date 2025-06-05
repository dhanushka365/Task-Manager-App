package com.taskmanager.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtConfig {
    private String secret = "mySecretKey123456789012345678901234567890";
    private long expiration = 86400; // 24 hours in seconds
}
