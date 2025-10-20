package com.cmc.fashion_store.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateProductRequest {

    // Không cần ID vì ID sẽ được lấy từ URL

    // private String imageUrl;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private String type;
    private String size;
    private String color;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = true, message = "Giá phải lớn hơn hoặc bằng 0")
    private BigDecimal price;

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Min(value = 0, message = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")
    private int stockQuantity;
}