package com.kaom.sahel.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.kaom.sahel.domain.Collection;
import com.kaom.sahel.repository.CollectionRepository;
import com.kaom.sahel.repository.ProductRepository;
import com.kaom.sahel.web.dto.CollectionDto;
import com.kaom.sahel.web.dto.CollectionInput;

@Service
@Transactional
public class CollectionAdminService {

    private final CollectionRepository collections;
    private final ProductRepository products;
    private final ImageStorage storage;

    public CollectionAdminService(CollectionRepository collections, ProductRepository products, ImageStorage storage) {
        this.collections = collections;
        this.products = products;
        this.storage = storage;
    }

    @Transactional(readOnly = true)
    public List<CollectionDto> all() {
        return collections.findAllByOrderByPositionAscNameAsc().stream()
                .map(c -> CollectionDto.from(c, products.countByCollection(c)))
                .toList();
    }

    public CollectionDto create(CollectionInput input) {
        String slug = StringUtils.hasText(input.slug()) ? input.slug() : Slugs.of(input.name());
        if (collections.existsBySlug(slug)) {
            throw new ConflictException("Une collection utilise déjà l'adresse « " + slug + " »");
        }
        Collection c = new Collection();
        c.setSlug(slug);
        apply(c, input);
        return CollectionDto.from(collections.save(c), 0);
    }

    public CollectionDto update(long id, CollectionInput input) {
        Collection c = find(id);
        if (StringUtils.hasText(input.slug()) && !input.slug().equals(c.getSlug())) {
            if (collections.existsBySlug(input.slug())) {
                throw new ConflictException("Une collection utilise déjà l'adresse « " + input.slug() + " »");
            }
            c.setSlug(input.slug());
        }
        apply(c, input);
        return CollectionDto.from(c, products.countByCollection(c));
    }

    public void delete(long id) {
        Collection c = find(id);
        if (products.countByCollection(c) > 0) {
            throw new ConflictException("Déplacez ou supprimez d'abord les articles de cette collection");
        }
        storage.delete(c.getCoverUrl());
        collections.delete(c);
    }

    public CollectionDto setCover(long id, MultipartFile file) {
        Collection c = find(id);
        String old = c.getCoverUrl();
        c.setCoverUrl(storage.store("collections/" + c.getId(), file));
        storage.delete(old);
        return CollectionDto.from(c, products.countByCollection(c));
    }

    private void apply(Collection c, CollectionInput in) {
        c.setName(in.name().trim());
        c.setSeason(in.season());
        c.setTagline(in.tagline());
        c.setDescription(in.description());
        if (StringUtils.hasText(in.coverUrl())) c.setCoverUrl(in.coverUrl());
        if (in.motif() != null) c.setMotif(in.motif());
        if (in.tone() != null) c.setTone(in.tone());
        c.setFeatured(in.featured());
        c.setPosition(in.position());
        c.setPublished(in.published());
        if (in.featured()) {
            collections.findAll().stream().filter(o -> o != c && o.isFeatured()).forEach(o -> o.setFeatured(false));
        }
    }

    private Collection find(long id) {
        return collections.findById(id).orElseThrow(() -> new NotFoundException("Collection introuvable"));
    }
}
