package com.kaom.sahel.web.dto;

import com.kaom.sahel.domain.Collection;

public record CollectionDto(
        Long id,
        String slug,
        String name,
        String season,
        String tagline,
        String description,
        String coverUrl,
        String motif,
        String tone,
        boolean featured,
        int position,
        boolean published,
        long productCount) {

    public static CollectionDto from(Collection c, long productCount) {
        return new CollectionDto(c.getId(), c.getSlug(), c.getName(), c.getSeason(), c.getTagline(),
                c.getDescription(), c.getCoverUrl(), c.getMotif(), c.getTone(), c.isFeatured(),
                c.getPosition(), c.isPublished(), productCount);
    }
}
