package com.kaom.sahel.web;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.kaom.sahel.config.KaomProperties;
import com.kaom.sahel.service.AuthService;
import com.kaom.sahel.service.NewsletterService;
import com.kaom.sahel.service.RequestService;
import com.kaom.sahel.web.dto.LoginRequest;
import com.kaom.sahel.web.dto.NewsletterInput;
import com.kaom.sahel.web.dto.RequestDto;
import com.kaom.sahel.web.dto.RequestInput;
import com.kaom.sahel.web.dto.SettingsDto;
import com.kaom.sahel.web.dto.TokenResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class PublicController {

    private final RequestService requests;
    private final NewsletterService newsletter;
    private final AuthService auth;
    private final KaomProperties properties;

    public PublicController(RequestService requests, NewsletterService newsletter, AuthService auth, KaomProperties properties) {
        this.requests = requests;
        this.newsletter = newsletter;
        this.auth = auth;
        this.properties = properties;
    }

    @GetMapping("/settings")
    public SettingsDto settings() {
        var s = properties.shop();
        return new SettingsDto(s.whatsapp(), s.instagram(), s.email(), s.address(), s.freeShippingThreshold());
    }

    @PostMapping("/requests")
    @ResponseStatus(HttpStatus.CREATED)
    public RequestDto createRequest(@Valid @RequestBody RequestInput input) {
        return requests.create(input);
    }

    @PostMapping("/newsletter")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void subscribe(@Valid @RequestBody NewsletterInput input) {
        newsletter.subscribe(input.email());
    }

    @PostMapping("/auth/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest input) {
        return auth.login(input.email(), input.password());
    }
}
