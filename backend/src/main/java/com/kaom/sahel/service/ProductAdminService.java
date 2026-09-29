package com.kaom.sahel.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.kaom.sahel.domain.Product;
import com.kaom.sahel.domain.ProductColor;
import com.kaom.sahel.domain.ProductImage;
import com.kaom.sahel.repository.CollectionRepository;
import com.kaom.sahel.repository.ProductRepository;
import com.kaom.sahel.web.dto.ProductDto;
import com.kaom.sahel.web.dto.ProductInput;

@Service
@Transactional
public class ProductAdminService {

    private static final int MAX_IMAGES = 8;

    private final ProductRepository products;
    private final CollectionRepository collections;
    private final ImageStorage storage;

    public ProductAdminService(ProductRepository products, CollectionRepository collections, ImageStorage storage) {
        this.products = products;
        this.collections = collections;
        this.storage = storage;
    }

    @Transactional(readOnly = true)
    public List<ProductDto> all() {
        return products.findAllByOrderByCreatedAtDescIdDesc().stream().map(ProductDto::from).toList();
    }

    @Transactional(readOnly = true)
    public ProductDto get(long id) {
        return ProductDto.from(find(id));
    }

    public ProductDto create(ProductInput input) {
        Product product = new Product();
        product.setSlug(uniqueSlug(StringUtils.hasText(input.slug()) ? input.slug() : Slugs.of(input.name()), null));
        apply(product, input);
        return ProductDto.from(products.save(product));
    }

    public ProductDto update(long id, ProductInput input) {
        Product product = find(id);
        if (StringUtils.hasText(input.slug()) && !input.slug().equals(product.getSlug())) {
            product.setSlug(uniqueSlug(input.slug(), product.getId()));
        }
        apply(product, input);
        return ProductDto.from(product);
    }

    public void delete(long id) {
        Product product = find(id);
        product.getImages().forEach(i -> storage.delete(i.getUrl()));
        products.delete(product);
    }

    public ProductDto addImages(long id, List<MultipartFile> files) {
        Product product = find(id);
        if (product.getImages().size() + files.size() > MAX_IMAGES) {
            throw new IllegalArgumentException("8 photos maximum par article");
        }
        for (MultipartFile file : files) {
            String url = storage.store("products/" + product.getId(), file);
            product.getImages().add(new ProductImage(product, url, product.getName(), product.getImages().size()));
        }
        return ProductDto.from(product);
    }

    public ProductDto removeImage(long id, long imageId) {
        Product product = find(id);
        ProductImage image = product.getImages().stream()
                .filter(i -> i.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Photo introuvable"));
        product.getImages().remove(image);
        storage.delete(image.getUrl());
        for (int i = 0; i < product.getImages().size(); i++) {
            product.getImages().get(i).setPosition(i);
        }
        return ProductDto.from(product);
    }

    private void apply(Product p, ProductInput in) {
        p.setName(in.name().trim());
        p.setCollection(StringUtils.hasText(in.collection())
                ? collections.findBySlug(in.collection()).orElseThrow(() -> new NotFoundException("Collection introuvable : " + in.collection()))
                : null);
        p.setCategory(in.category());
        p.setGender(in.gender());
        p.setPrice(in.price());
        p.setOldPrice(in.oldPrice() != null && in.oldPrice() > in.price() ? in.oldPrice() : null);
        p.setFabric(in.fabric());
        p.setDescription(in.description());
        if (in.motif() != null) p.setMotif(in.motif());
        if (in.tone() != null) p.setTone(in.tone());
        p.setBadge(StringUtils.hasText(in.badge()) ? in.badge().trim() : null);
        p.setBestseller(in.bestseller());
        p.setStatus(in.status());
        p.setStock(in.stock());
        p.getSizes().clear();
        if (in.sizes() != null) p.getSizes().addAll(in.sizes().stream().map(String::trim).distinct().toList());
        p.getColors().clear();
        if (in.colors() != null) in.colors().forEach(c -> p.getColors().add(new ProductColor(c.name().trim(), c.hex().toUpperCase())));
    }

    private Product find(long id) {
        return products.findById(id).orElseThrow(() -> new NotFoundException("Article introuvable"));
    }

    private String uniqueSlug(String base, Long selfId) {
        String slug = base;
        int n = 2;
        while (true) {
            var existing = products.findBySlug(slug);
            if (existing.isEmpty() || existing.get().getId().equals(selfId)) {
                return slug;
            }
            slug = base + "-" + n++;
        }
    }
}
