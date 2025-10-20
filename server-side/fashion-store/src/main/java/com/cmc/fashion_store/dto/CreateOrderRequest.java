package com.cmc.fashion_store.dto;

// import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
// import java.math.BigDecimal;

@Data
public class CreateOrderRequest {

    @NotNull(message = "Mã khách hàng không được để trống")
    private Long customerId; // Mã KH

    @NotBlank(message = "Trạng thái không được để trống")
    private String status;

    // @NotNull(message = "Tổng tiền không được để trống")
    // @DecimalMin(value = "0.0", inclusive = false, message = "Tổng tiền phải là một số dương")
    // private BigDecimal totalAmount;

    // Trường "Ngày" (orderDate) sẽ được tự động tạo ở backend khi đơn hàng được tạo.
}