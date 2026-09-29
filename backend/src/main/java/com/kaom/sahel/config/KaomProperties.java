package com.kaom.sahel.config;

import java.time.Duration;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Configuration propre à KAOM, alimentée par les variables d'environnement (voir .env.example). */
@ConfigurationProperties(prefix = "kaom")
public record KaomProperties(Jwt jwt, Admin admin, Uploads uploads, List<String> corsOrigins, Shop shop) {

    public record Jwt(String secret, Duration ttl) {
    }

    public record Admin(String email, String password, String name) {
    }

    public record Uploads(String dir) {
    }

    public record Shop(String whatsapp, String instagram, String email, String address, int freeShippingThreshold) {
    }
}
