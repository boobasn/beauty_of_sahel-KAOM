package com.kaom.sahel.web;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kaom.sahel.domain.Category;
import com.kaom.sahel.service.CatalogService;
import com.kaom.sahel.web.dto.CollectionDto;
import com.kaom.sahel.web.dto.ProductDto;

@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CatalogService catalog;

    public CatalogController(CatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/collections")
    public List<CollectionDto> collections() {
        return catalog.publishedCollections();
    }

    @GetMapping("/collections/{slug}")
    public CollectionDto collection(@PathVariable String slug) {
        return catalog.collection(slug);
    }

    @GetMapping("/products")
    public List<ProductDto> products(@RequestParam(required = false) String collection,
                                     @RequestParam(required = false) Category category,
                                     @RequestParam(required = false) String q) {
        return catalog.visibleProducts(collection, category, q);
    }

    @GetMapping("/products/{slug}")
    public ProductDto product(@PathVariable String slug) {
        return catalog.visibleProduct(slug);
    }
}
