package com.cmc.fashion_store.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * DTO này đại diện cho toàn bộ yêu cầu tạo đơn hàng mới,
 * bao gồm thông tin chung (khách hàng, khuyến mãi)
 * và danh sách các sản phẩm (chi tiết đơn hàng).
 */
@Data
public class CreateOrderWithDetailsRequest {

    @NotNull(message = "ID khách hàng không được để trống")
    private Long customerId;

    // Khuyến mãi có thể không có (null)
    private Long promotionId;

    // Đảm bảo danh sách chi tiết không bị rỗng
    @NotEmpty(message = "Đơn hàng phải có ít nhất một sản phẩm")
    @Valid // <-- Rất quan trọng: Báo cho Spring Boot kiểm tra (validate) các object bên trong List
    private List<OrderDetailItem> details;
}