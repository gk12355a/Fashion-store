package com.cmc.fashion_store.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "discount_value", nullable = false)
    private Double discountValue;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", length = 20)
    private String status = "ACTIVE";

    // Constructors
    public Promotion() {}

    public Promotion(String name, Double discountValue, LocalDateTime expiryDate, String type, String description, String status) {
        this.name = name;
        this.discountValue = discountValue;
        this.expiryDate = expiryDate;
        this.type = type;
        this.description = description;
        this.status = status;
    }
}