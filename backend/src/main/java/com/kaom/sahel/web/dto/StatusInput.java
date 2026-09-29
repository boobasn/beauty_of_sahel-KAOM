package com.kaom.sahel.web.dto;

import com.kaom.sahel.domain.RequestStatus;

import jakarta.validation.constraints.NotNull;

public record StatusInput(@NotNull RequestStatus status) {
}
