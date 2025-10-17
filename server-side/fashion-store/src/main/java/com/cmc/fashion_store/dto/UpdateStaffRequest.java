package com.cmc.fashion_store.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
@Data
public class UpdateStaffRequest {
    // Không cần ID vì ID sẽ được lấy từ URL
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 2, max = 20, message = "Tên phải từ 2 đến 20 ký tự")
    private String name;    
    @NotBlank(message = "Chức vụ không được sé trống")
    @Size(min = 2, max = 50, message = "Chức vụ phải từ 2 đến 50 ký tự")
    private String position;
    @NotNull(message = "Lương không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Lương phải lớn hơn 0")
    private BigDecimal salary;
    @NotBlank(message = "Ca làm việc không được để trống")
    private String workShift;
}
