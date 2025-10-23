package com.cmc.fashion_store.dto;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
@Data
public class CreateStaffRequest {
      // Không cần ID vì database sẽ tự sinh ra khi tạo mới
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 2, max = 20, message = "Tên phải từ 2 đến 20 ký tự")
    private String name;
    @NotBlank(message = "Chức vụ không được để trống")
    @Size(min = 2, max = 50, message = "Chức vụ phải từ 2 đến 50 ký tự")
    private String position;
    @NotNull(message = "Lương không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Lương phải lớn hơn 0")
    private BigDecimal salary;
    @NotBlank(message = "Ca làm việc không được để trống")
    private String workShift;
}
