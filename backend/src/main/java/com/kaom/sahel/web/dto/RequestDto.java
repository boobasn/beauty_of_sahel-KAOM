package com.kaom.sahel.web.dto;

import java.time.Instant;

import com.kaom.sahel.domain.CustomerRequest;
import com.kaom.sahel.domain.RequestStatus;
import com.kaom.sahel.domain.RequestType;

public record RequestDto(
        Long id,
        RequestType type,
        RequestStatus status,
        String customerName,
        String phone,
        String email,
        String message,
        String items,
        int total,
        Instant createdAt) {

    public static RequestDto from(CustomerRequest r) {
        return new RequestDto(r.getId(), r.getType(), r.getStatus(), r.getCustomerName(), r.getPhone(),
                r.getEmail(), r.getMessage(), r.getItems(), r.getTotal(), r.getCreatedAt());
    }
}
