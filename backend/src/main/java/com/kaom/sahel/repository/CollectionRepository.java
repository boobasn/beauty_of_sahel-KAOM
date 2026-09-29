package com.kaom.sahel.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaom.sahel.domain.Collection;

public interface CollectionRepository extends JpaRepository<Collection, Long> {

    Optional<Collection> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Collection> findAllByOrderByPositionAscNameAsc();

    List<Collection> findByPublishedTrueOrderByPositionAscNameAsc();
}
