package com.kaom.sahel.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Commande ou demande envoyée depuis le site, suivie dans le backoffice. */
@Entity
@Table(name = "customer_requests")
public class CustomerRequest extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.NEW;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String phone;

    private String email;
    private String message;

    /** Détail lisible des articles commandés, une ligne par article. */
    private String items;

    private int total;

    public Long getId() { return id; }
    public RequestType getType() { return type; }
    public void setType(RequestType type) { this.type = type; }
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getItems() { return items; }
    public void setItems(String items) { this.items = items; }
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
}
