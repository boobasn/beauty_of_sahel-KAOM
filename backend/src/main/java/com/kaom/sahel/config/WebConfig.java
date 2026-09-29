package com.kaom.sahel.config;

import java.nio.file.Path;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Sert les photos envoyées depuis le backoffice sous /uploads/**. */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final KaomProperties properties;

    public WebConfig(KaomProperties properties) {
        this.properties = properties;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Path.of(properties.uploads().dir()).toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location.endsWith("/") ? location : location + "/")
                .setCachePeriod(60 * 60 * 24 * 30);
    }
}
