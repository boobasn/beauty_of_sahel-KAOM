package com.kaom.sahel.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ProductColor {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String hex;

    protected ProductColor() {
    }

    public ProductColor(String name, String hex) {
        this.name = name;
        this.hex = hex;
    }

    public String getName() { return name; }
    public String getHex() { return hex; }
}
