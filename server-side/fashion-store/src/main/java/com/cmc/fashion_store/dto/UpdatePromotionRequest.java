package com.cmc.fashion_store.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdatePromotionRequest {

    @NotBlank(message = "Tên khuyến mãi không được để trống")
    private String name;

    @NotBlank(message = "Loại khuyến mãi không được để trống")
    private String type;

    @NotNull(message = "Giá trị giảm giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = true, message = "Giá trị giảm giá phải lớn hơn hoặc bằng 0")
    private BigDecimal discountValue;

    @NotNull(message = "Thời hạn không được để trống")
    @FutureOrPresent(message = "Thời hạn phải là ngày hiện tại hoặc trong tương lai")
    private LocalDate expiryDate;
}