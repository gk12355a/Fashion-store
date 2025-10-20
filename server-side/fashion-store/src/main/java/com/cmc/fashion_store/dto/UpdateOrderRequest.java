package com.cmc.fashion_store.dto;

// import jakarta.validation.constraints.DecimalMin;
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.NotNull;
import lombok.Data;
// import java.math.BigDecimal;

@Data
public class UpdateOrderRequest {

    // Trong thực tế, có thể bạn chỉ muốn cho phép cập nhật trạng thái.
    // Việc cập nhật tổng tiền thường sẽ được tính toán lại từ chi tiết đơn hàng.
    // Ở đây chúng ta sẽ làm theo backlog.

    // @NotBlank(message = "Trạng thái không được để trống")
    // private String status;

    // @NotNull(message = "Tổng tiền không được để trống")
    // @DecimalMin(value = "0.0", inclusive = false, message = "Tổng tiền phải là một số dương")
    // private BigDecimal totalAmount;

    // ID của khách hàng và ngày đặt hàng thường không được thay đổi.
}