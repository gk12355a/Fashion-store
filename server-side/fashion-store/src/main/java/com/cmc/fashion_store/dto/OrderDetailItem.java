package com.cmc.fashion_store.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO này đại diện cho một món hàng (product + quantity)
 * mà frontend gửi lên khi tạo đơn hàng mới.
 */
@Data
public class OrderDetailItem {

    @NotNull(message = "ID sản phẩm không được để trống")
    private Long productId;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải ít nhất là 1")
    private int quantity;

    // Frontend KHÔNG cần gửi unitPrice.
    // Backend sẽ TỰ ĐỘNG lấy giá từ ProductRepository để đảm bảo an toàn.
}