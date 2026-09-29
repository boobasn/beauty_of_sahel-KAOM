package com.kaom.sahel.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.kaom.sahel.domain.AdminUser;
import com.kaom.sahel.repository.AdminUserRepository;

/** Crée le compte de la créatrice au premier démarrage, à partir de KAOM_ADMIN_EMAIL et KAOM_ADMIN_PASSWORD. */
@Component
public class AdminInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);

    private final AdminUserRepository admins;
    private final PasswordEncoder encoder;
    private final KaomProperties properties;

    public AdminInitializer(AdminUserRepository admins, PasswordEncoder encoder, KaomProperties properties) {
        this.admins = admins;
        this.encoder = encoder;
        this.properties = properties;
    }

    @Override
    public void run(ApplicationArguments args) {
        KaomProperties.Admin admin = properties.admin();
        if (admins.count() > 0) {
            return;
        }
        if (!StringUtils.hasText(admin.email()) || !StringUtils.hasText(admin.password())) {
            log.warn("Aucun compte administrateur : définissez KAOM_ADMIN_EMAIL et KAOM_ADMIN_PASSWORD");
            return;
        }
        if (admin.password().length() < 10) {
            throw new IllegalStateException("KAOM_ADMIN_PASSWORD doit contenir au moins 10 caractères");
        }
        admins.save(new AdminUser(admin.email().trim().toLowerCase(), encoder.encode(admin.password()), admin.name()));
        log.info("Compte administrateur créé pour {}", admin.email());
    }
}
