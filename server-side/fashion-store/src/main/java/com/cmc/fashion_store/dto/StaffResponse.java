package com.cmc.fashion_store.dto;

import lombok.Data;
// Bỏ các trường không cần thiết như salary, workShift nếu không muốn hiển thị
@Data
public class StaffResponse {
    private Long id;
    private String name;
    // private String position;
}