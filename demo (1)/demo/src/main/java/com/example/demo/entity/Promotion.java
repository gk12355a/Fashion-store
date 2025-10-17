package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên khuyến mãi là bắt buộc")
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @NotNull(message = "Giá trị khuyến mãi là bắt buộc")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá trị khuyến mãi phải lớn hơn 0")
    @Column(name = "discount_value", nullable = false)
    private Double discountValue;

    @NotNull(message = "Ngày hết hạn là bắt buộc")
    @Future(message = "Ngày hết hạn phải là tương lai")
    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @NotBlank(message = "Loại khuyến mãi là bắt buộc")
    @Pattern(regexp = "PERCENTAGE|FIXED_AMOUNT", message = "Loại khuyến mãi phải là PERCENTAGE hoặc FIXED_AMOUNT")
    @Column(name = "type", nullable = false, length = 50)
    private String type;

    // Constructors
    public Promotion() {}

    public Promotion(String name, Double discountValue, LocalDateTime expiryDate, String type) {
        this.name = name;
        this.discountValue = discountValue;
        this.expiryDate = expiryDate;
        this.type = type;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}