package com.kaom.sahel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaom.sahel.domain.NewsletterSubscriber;

public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {

    boolean existsByEmailIgnoreCase(String email);

    List<NewsletterSubscriber> findAllByOrderByCreatedAtDesc();
}
