package com.kaom.sahel.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private String url;

    private String alt;
    private int position;

    protected ProductImage() {
    }

    public ProductImage(Product product, String url, String alt, int position) {
        this.product = product;
        this.url = url;
        this.alt = alt;
        this.position = position;
    }

    public Long getId() { return id; }
    public Product getProduct() { return product; }
    public String getUrl() { return url; }
    public String getAlt() { return alt; }
    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
}
