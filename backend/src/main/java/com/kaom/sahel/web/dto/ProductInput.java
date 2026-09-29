package com.kaom.sahel.web.dto;

import java.util.List;

import com.kaom.sahel.domain.Category;
import com.kaom.sahel.domain.Gender;
import com.kaom.sahel.domain.ProductStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProductInput(
        @NotBlank @Size(max = 160) String name,
        @Size(max = 160) @Pattern(regexp = "^$|^[a-z0-9]+(-[a-z0-9]+)*$", message = "lettres minuscules, chiffres et tirets") String slug,
        String collection,
        @NotNull Category category,
        @NotNull Gender gender,
        @Min(0) @Max(100_000_000) int price,
        @Min(0) @Max(100_000_000) Integer oldPrice,
        @Size(max = 300) String fabric,
        @Size(max = 4000) String description,
        @Pattern(regexp = "bazin|bogolan|indigo|wax|tissage") String motif,
        @Pattern(regexp = "indigo|henne|sable|nuit|mil") String tone,
        @Size(max = 40) String badge,
        boolean bestseller,
        @NotNull ProductStatus status,
        @Min(0) int stock,
        @Size(max = 12) List<@NotBlank @Size(max = 30) String> sizes,
        @Size(max = 12) List<@Valid ColorInput> colors) {

    public record ColorInput(
            @NotBlank @Size(max = 60) String name,
            @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") String hex) {
    }
}
