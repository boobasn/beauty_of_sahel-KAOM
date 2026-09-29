package com.kaom.sahel.service;

import java.time.Instant;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.kaom.sahel.config.KaomProperties;
import com.kaom.sahel.domain.AdminUser;
import com.kaom.sahel.repository.AdminUserRepository;
import com.kaom.sahel.web.dto.TokenResponse;

@Service
public class AuthService {

    private final AdminUserRepository admins;
    private final PasswordEncoder encoder;
    private final JwtEncoder jwtEncoder;
    private final KaomProperties properties;

    public AuthService(AdminUserRepository admins, PasswordEncoder encoder, JwtEncoder jwtEncoder, KaomProperties properties) {
        this.admins = admins;
        this.encoder = encoder;
        this.jwtEncoder = jwtEncoder;
        this.properties = properties;
    }

    public TokenResponse login(String email, String password) {
        AdminUser user = admins.findByEmailIgnoreCase(email.trim())
                .filter(u -> encoder.matches(password, u.getPasswordHash()))
                .orElseThrow(() -> new BadCredentialsException("E-mail ou mot de passe incorrect"));
        Instant now = Instant.now();
        Instant expiresAt = now.plus(properties.jwt().ttl());
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("kaom-sahel-api")
                .issuedAt(now)
                .expiresAt(expiresAt)
                .subject(user.getEmail())
                .claim("scope", "admin")
                .build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
        return new TokenResponse(token, expiresAt, user.getEmail(), user.getDisplayName());
    }
}
