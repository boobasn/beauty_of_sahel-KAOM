package com.kaom.sahel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SahelApplication {

    public static void main(String[] args) {
        SpringApplication.run(SahelApplication.class, args);
    }
}
