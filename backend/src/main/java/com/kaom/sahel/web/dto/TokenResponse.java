package com.kaom.sahel.web.dto;

import java.time.Instant;

public record TokenResponse(String token, Instant expiresAt, String email, String name) {
}
