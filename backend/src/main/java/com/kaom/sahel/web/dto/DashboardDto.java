package com.kaom.sahel.web.dto;

public record DashboardDto(
        long productsPublished,
        long productsTotal,
        long lowStock,
        long collections,
        long requestsNew,
        long requestsThisWeek,
        long subscribers) {
}
