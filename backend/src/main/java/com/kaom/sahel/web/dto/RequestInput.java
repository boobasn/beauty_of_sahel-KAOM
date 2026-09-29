package com.kaom.sahel.web.dto;

import java.util.List;

import com.kaom.sahel.domain.RequestType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Commande ou demande envoyée depuis le site. Les prix sont recalculés côté serveur. */
public record RequestInput(
        @NotNull RequestType type,
        @NotBlank @Size(max = 120) String customerName,
        @NotBlank @Size(max = 40) String phone,
        @Email @Size(max = 160) String email,
        @Size(max = 2000) String message,
        @Size(max = 30) List<@Valid Item> items) {

    public record Item(
            @NotBlank String slug,
            @Size(max = 30) String size,
            @Size(max = 60) String color,
            @Min(1) @Max(20) int qty) {
    }
}
