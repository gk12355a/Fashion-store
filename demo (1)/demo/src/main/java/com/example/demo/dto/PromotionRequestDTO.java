package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PromotionRequestDTO {

    @NotBlank(message = "Tên khuyến mãi là bắt buộc")
    @Size(max = 255, message = "Tên khuyến mãi không được vượt quá 255 ký tự")
    private String name;

    @NotNull(message = "Giá trị khuyến mãi là bắt buộc")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá trị khuyến mãi phải lớn hơn 0")
    @Digits(integer = 10, fraction = 2, message = "Giá trị khuyến mãi không hợp lệ")
    private Double discountValue;

    @NotNull(message = "Ngày hết hạn là bắt buộc")
    @Future(message = "Ngày hết hạn phải là tương lai")
    private LocalDateTime expiryDate;

    @NotBlank(message = "Loại khuyến mãi là bắt buộc")
    @Pattern(regexp = "PERCENTAGE|FIXED_AMOUNT", message = "Loại khuyến mãi phải là PERCENTAGE hoặc FIXED_AMOUNT")
    private String type;

    private String description;
}