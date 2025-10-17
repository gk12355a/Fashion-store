package com.cmc.fashion_store.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCustomerRequest {

    @NotBlank(message = "Tên khách hàng không được để trống")
    private String name;

    private String phoneNumber;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng email không hợp lệ")
    private String email;

    private String membershipType;

    @NotNull(message = "Điểm thưởng không được để trống")
    @Min(value = 0, message = "Điểm thưởng phải lớn hơn hoặc bằng 0")
    private int rewardPoints;
}