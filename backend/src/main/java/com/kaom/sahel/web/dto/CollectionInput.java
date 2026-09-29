package com.kaom.sahel.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CollectionInput(
        @NotBlank @Size(max = 120) String name,
        @Size(max = 120) @Pattern(regexp = "^$|^[a-z0-9]+(-[a-z0-9]+)*$", message = "lettres minuscules, chiffres et tirets") String slug,
        @Size(max = 120) String season,
        @Size(max = 300) String tagline,
        @Size(max = 2000) String description,
        @Size(max = 500) String coverUrl,
        @Pattern(regexp = "bazin|bogolan|indigo|wax|tissage") String motif,
        @Pattern(regexp = "indigo|henne|sable|nuit|mil") String tone,
        boolean featured,
        int position,
        boolean published) {
}
