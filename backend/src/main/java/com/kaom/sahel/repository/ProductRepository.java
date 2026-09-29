package com.kaom.sahel.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.kaom.sahel.domain.Collection;
import com.kaom.sahel.domain.Product;
import com.kaom.sahel.domain.ProductStatus;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Product> findAllByOrderByCreatedAtDescIdDesc();

    /** Articles visibles sur le site : publiés, hors collection masquée. */
    @Query("""
            select p from Product p left join p.collection c
            where p.status = com.kaom.sahel.domain.ProductStatus.PUBLISHED
              and (c is null or c.published = true)
            order by p.createdAt desc, p.id desc
            """)
    List<Product> findVisible();

    long countByStatus(ProductStatus status);

    long countByCollection(Collection collection);

    long countByStockLessThanEqual(int stock);
}
