package com.kaom.sahel.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.kaom.sahel.domain.Category;
import com.kaom.sahel.domain.Product;
import com.kaom.sahel.domain.ProductStatus;
import com.kaom.sahel.repository.CollectionRepository;
import com.kaom.sahel.repository.ProductRepository;
import com.kaom.sahel.web.dto.CollectionDto;
import com.kaom.sahel.web.dto.ProductDto;

/** Lecture du catalogue pour le site public. */
@Service
@Transactional(readOnly = true)
public class CatalogService {

    private final CollectionRepository collections;
    private final ProductRepository products;

    public CatalogService(CollectionRepository collections, ProductRepository products) {
        this.collections = collections;
        this.products = products;
    }

    public List<CollectionDto> publishedCollections() {
        List<Product> visible = products.findVisible();
        return collections.findByPublishedTrueOrderByPositionAscNameAsc().stream()
                .map(c -> CollectionDto.from(c, visible.stream()
                        .filter(p -> p.getCollection() != null && p.getCollection().getId().equals(c.getId()))
                        .count()))
                .toList();
    }

    public CollectionDto collection(String slug) {
        return publishedCollections().stream()
                .filter(c -> c.slug().equals(slug))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Collection introuvable : " + slug));
    }

    public List<ProductDto> visibleProducts(String collection, Category category, String query) {
        String q = StringUtils.hasText(query) ? query.toLowerCase(Locale.ROOT).trim() : null;
        return products.findVisible().stream()
                .filter(p -> collection == null || (p.getCollection() != null && p.getCollection().getSlug().equals(collection)))
                .filter(p -> category == null || p.getCategory() == category)
                .filter(p -> q == null || p.getName().toLowerCase(Locale.ROOT).contains(q)
                        || (p.getFabric() != null && p.getFabric().toLowerCase(Locale.ROOT).contains(q)))
                .map(ProductDto::from)
                .toList();
    }

    public ProductDto visibleProduct(String slug) {
        return products.findBySlug(slug)
                .filter(p -> p.getStatus() == ProductStatus.PUBLISHED)
                .filter(p -> p.getCollection() == null || p.getCollection().isPublished())
                .map(ProductDto::from)
                .orElseThrow(() -> new NotFoundException("Article introuvable : " + slug));
    }
}
