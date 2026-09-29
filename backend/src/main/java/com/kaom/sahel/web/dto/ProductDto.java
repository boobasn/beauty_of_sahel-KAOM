package com.kaom.sahel.web.dto;

import java.util.List;

import com.kaom.sahel.domain.Category;
import com.kaom.sahel.domain.Gender;
import com.kaom.sahel.domain.Product;
import com.kaom.sahel.domain.ProductStatus;

public record ProductDto(
        Long id,
        String slug,
        String name,
        String collection,
        String collectionName,
        Category category,
        Gender gender,
        int price,
        Integer oldPrice,
        String fabric,
        String description,
        String motif,
        String tone,
        String badge,
        boolean bestseller,
        ProductStatus status,
        int stock,
        List<String> sizes,
        List<ColorDto> colors,
        List<ImageDto> images) {

    public record ColorDto(String name, String hex) {
    }

    public record ImageDto(Long id, String url, String alt) {
    }

    public static ProductDto from(Product p) {
        var c = p.getCollection();
        return new ProductDto(p.getId(), p.getSlug(), p.getName(),
                c == null ? null : c.getSlug(), c == null ? null : c.getName(),
                p.getCategory(), p.getGender(), p.getPrice(), p.getOldPrice(), p.getFabric(), p.getDescription(),
                p.getMotif(), p.getTone(), p.getBadge(), p.isBestseller(), p.getStatus(), p.getStock(),
                List.copyOf(p.getSizes()),
                p.getColors().stream().map(col -> new ColorDto(col.getName(), col.getHex())).toList(),
                p.getImages().stream().map(i -> new ImageDto(i.getId(), i.getUrl(), i.getAlt())).toList());
    }
}
