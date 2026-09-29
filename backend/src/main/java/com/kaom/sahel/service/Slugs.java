package com.kaom.sahel.service;

import java.text.Normalizer;
import java.util.Locale;

public final class Slugs {

    private Slugs() {
    }

    /** « Grand boubou Latérite » → « grand-boubou-laterite ». */
    public static String of(String text) {
        String ascii = Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        String slug = ascii.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
        return slug.isEmpty() ? "article" : slug;
    }
}
