package com.cmc.fashion_store.dto;

// import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
// import java.math.BigDecimal;

@Data
public class CreatePaymentRequest {

    @NotNull(message = "Mã đơn hàng không được để trống")
    private Long orderId;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod;

    @NotNull(message = "Mã nhân viên thực hiện không được để trống")
    private Long staffId;
    // @NotNull(message = "Số tiền không được để trống")
    // @DecimalMin(value = "0.0", inclusive = true, message = "Số tiền phải lớn hơn hoặc bằng 0")
    // private BigDecimal amount;

    // Trường "Ngày TT" (paymentDate) sẽ được tự động tạo ở backend.
}