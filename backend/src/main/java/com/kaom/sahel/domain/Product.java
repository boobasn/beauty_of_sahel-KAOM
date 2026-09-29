package com.kaom.sahel.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_id")
    private Collection collection;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    /** Prix en francs CFA (XOF), sans décimales. */
    @Column(nullable = false)
    private int price;

    @Column(name = "old_price")
    private Integer oldPrice;

    private String fabric;
    private String description;

    @Column(nullable = false)
    private String motif = "bazin";

    @Column(nullable = false)
    private String tone = "sable";

    private String badge;
    private boolean bestseller;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.DRAFT;

    private int stock;

    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "position")
    @Column(name = "size")
    private List<String> sizes = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "position")
    private List<ProductColor> colors = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    private List<ProductImage> images = new ArrayList<>();

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Collection getCollection() { return collection; }
    public void setCollection(Collection collection) { this.collection = collection; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }
    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }
    public Integer getOldPrice() { return oldPrice; }
    public void setOldPrice(Integer oldPrice) { this.oldPrice = oldPrice; }
    public String getFabric() { return fabric; }
    public void setFabric(String fabric) { this.fabric = fabric; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }
    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
    public boolean isBestseller() { return bestseller; }
    public void setBestseller(boolean bestseller) { this.bestseller = bestseller; }
    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public List<String> getSizes() { return sizes; }
    public List<ProductColor> getColors() { return colors; }
    public List<ProductImage> getImages() { return images; }
}
