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
    @Size(max = 255, message = "Tên khuyến mãi không được vượt quá 255 ký tự")
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "Mã khuyến mãi là bắt buộc")
    @Size(max = 50, message = "Mã khuyến mãi không được vượt quá 50 ký tự")
    @Pattern(regexp = "^[A-Z0-9_]+$", message = "Mã khuyến mãi chỉ được chứa chữ hoa, số và dấu gạch dưới")
    @Column(name = "code", unique = true, nullable = false)
    private String code;

    @Size(max = 1000, message = "Mô tả không được vượt quá 1000 ký tự")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Giá trị khuyến mãi là bắt buộc")
    @DecimalMin(value = "0.0", message = "Giá trị khuyến mãi phải lớn hơn hoặc bằng 0")
    @DecimalMax(value = "1000000000", message = "Giá trị khuyến mãi quá lớn")
    @Column(name = "discount_value")
    private Double discountValue;

    @NotBlank(message = "Loại khuyến mãi là bắt buộc")
    @Pattern(regexp = "PERCENTAGE|FIXED_AMOUNT", message = "Loại khuyến mãi không hợp lệ")
    @Column(name = "discount_type")
    private String discountType;

    @NotNull(message = "Ngày bắt đầu là bắt buộc")
    @FutureOrPresent(message = "Ngày bắt đầu phải là hiện tại hoặc tương lai")
    @Column(name = "start_date")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc là bắt buộc")
    @Future(message = "Ngày kết thúc phải là tương lai")
    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Min(value = 0, message = "Số lượng phải lớn hơn hoặc bằng 0")
    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "used_count")
    private Integer usedCount = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Promotion() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }

    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public Integer getUsedCount() { return usedCount; }
    public void setUsedCount(Integer usedCount) { this.usedCount = usedCount; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}