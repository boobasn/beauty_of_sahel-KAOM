package com.kaom.sahel.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaom.sahel.domain.NewsletterSubscriber;
import com.kaom.sahel.repository.NewsletterSubscriberRepository;

@Service
@Transactional
public class NewsletterService {

    private final NewsletterSubscriberRepository subscribers;

    public NewsletterService(NewsletterSubscriberRepository subscribers) {
        this.subscribers = subscribers;
    }

    /** Inscription idempotente : une adresse déjà inscrite ne provoque pas d'erreur. */
    public void subscribe(String email) {
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        if (!subscribers.existsByEmailIgnoreCase(normalized)) {
            subscribers.save(new NewsletterSubscriber(normalized));
        }
    }

    @Transactional(readOnly = true)
    public List<NewsletterSubscriber> all() {
        return subscribers.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public long count() {
        return subscribers.count();
    }
}
