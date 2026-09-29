package com.kaom.sahel.web.admin;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaom.sahel.domain.ProductStatus;
import com.kaom.sahel.repository.CollectionRepository;
import com.kaom.sahel.repository.ProductRepository;
import com.kaom.sahel.service.NewsletterService;
import com.kaom.sahel.service.RequestService;
import com.kaom.sahel.web.dto.DashboardDto;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    private final ProductRepository products;
    private final CollectionRepository collections;
    private final RequestService requests;
    private final NewsletterService newsletter;

    public AdminDashboardController(ProductRepository products, CollectionRepository collections,
                                    RequestService requests, NewsletterService newsletter) {
        this.products = products;
        this.collections = collections;
        this.requests = requests;
        this.newsletter = newsletter;
    }

    @GetMapping("/me")
    public Map<String, String> me(@AuthenticationPrincipal Jwt jwt) {
        return Map.of("email", jwt.getSubject());
    }

    @GetMapping("/dashboard")
    @Transactional(readOnly = true)
    public DashboardDto dashboard() {
        return new DashboardDto(
                products.countByStatus(ProductStatus.PUBLISHED),
                products.count(),
                products.countByStockLessThanEqual(2),
                collections.count(),
                requests.countNew(),
                requests.countSince(7),
                newsletter.count());
    }

    @GetMapping("/newsletter")
    public List<Map<String, Object>> subscribers() {
        return newsletter.all().stream()
                .map(s -> Map.<String, Object>of("email", s.getEmail(), "createdAt", s.getCreatedAt()))
                .toList();
    }
}
