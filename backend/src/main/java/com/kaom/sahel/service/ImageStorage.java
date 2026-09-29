package com.kaom.sahel.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.kaom.sahel.config.KaomProperties;

/** Enregistre les photos sur disque (volume Docker) et renvoie leur URL publique /uploads/... */
@Service
public class ImageStorage {

    private static final Map<String, String> EXTENSIONS = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/webp", "webp");

    private final Path root;

    public ImageStorage(KaomProperties properties) throws IOException {
        this.root = Path.of(properties.uploads().dir()).toAbsolutePath().normalize();
        Files.createDirectories(root);
    }

    public String store(String folder, MultipartFile file) {
        String ext = EXTENSIONS.get(file.getContentType());
        if (ext == null || file.isEmpty()) {
            throw new IllegalArgumentException("Format accepté : JPG, PNG ou WebP");
        }
        String name = UUID.randomUUID() + "." + ext;
        Path dir = root.resolve(folder).normalize();
        if (!dir.startsWith(root)) {
            throw new IllegalArgumentException("Dossier invalide");
        }
        try (InputStream in = file.getInputStream()) {
            Files.createDirectories(dir);
            Files.copy(in, dir.resolve(name), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Impossible d'enregistrer la photo", e);
        }
        return "/uploads/" + folder + "/" + name;
    }

    public void delete(String url) {
        if (url == null || !url.startsWith("/uploads/")) {
            return;
        }
        Path file = root.resolve(url.substring("/uploads/".length())).normalize();
        if (file.startsWith(root)) {
            try {
                Files.deleteIfExists(file);
            } catch (IOException ignored) {
                // Le fichier orphelin sera sans effet sur le site.
            }
        }
    }
}
