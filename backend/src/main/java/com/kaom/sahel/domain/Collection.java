package com.kaom.sahel.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "collections")
public class Collection extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String name;

    private String season;
    private String tagline;
    private String description;

    @Column(name = "cover_url")
    private String coverUrl;

    @Column(nullable = false)
    private String motif = "bazin";

    @Column(nullable = false)
    private String tone = "sable";

    private boolean featured;
    private int position;
    private boolean published = true;

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
}
