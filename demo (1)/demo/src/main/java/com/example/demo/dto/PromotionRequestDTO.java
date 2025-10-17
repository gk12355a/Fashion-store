package com.example.demo.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class PromotionRequestDTO {

    @NotBlank(message = "Tên khuyến mãi là bắt buộc")
    @Size(max = 255, message = "Tên khuyến mãi không được vượt quá 255 ký tự")
    private String name;

    @NotBlank(message = "Mã khuyến mãi là bắt buộc")
    @Size(max = 50, message = "Mã khuyến mãi không được vượt quá 50 ký tự")
    @Pattern(regexp = "^[A-Z0-9_]+$", message = "Mã khuyến mãi chỉ được chứa chữ hoa, số và dấu gạch dưới")
    private String code;

    @Size(max = 1000, message = "Mô tả không được vượt quá 1000 ký tự")
    private String description;

    @NotNull(message = "Giá trị khuyến mãi là bắt buộc")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá trị khuyến mãi phải lớn hơn 0")
    @Digits(integer = 10, fraction = 2, message = "Giá trị khuyến mãi không hợp lệ")
    private Double discountValue;

    @NotBlank(message = "Loại khuyến mãi là bắt buộc")
    @Pattern(regexp = "PERCENTAGE|FIXED_AMOUNT", message = "Loại khuyến mãi không hợp lệ")
    private String discountType;

    @NotNull(message = "Ngày bắt đầu là bắt buộc")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc là bắt buộc")
    private LocalDateTime endDate;

    @Min(value = 1, message = "Số lượng phải lớn hơn hoặc bằng 1")
    private Integer usageLimit;

    private Boolean isActive = true;

    // Getters and Setters
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

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}