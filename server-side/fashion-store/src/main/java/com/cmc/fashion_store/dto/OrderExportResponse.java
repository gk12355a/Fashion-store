package com.cmc.fashion_store.dto;

import com.opencsv.bean.CsvBindByPosition;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO này CHỈ DÙNG ĐỂ XUẤT BÁO CÁO CSV.
 * Chỉ dùng 'position' để định nghĩa thứ tự cột.
 */
@Data
public class OrderExportResponse {

    @CsvBindByPosition(position = 0) // Chỉ giữ lại position
    private Long id;

    @CsvBindByPosition(position = 1)
    private LocalDateTime orderDate;

    @CsvBindByPosition(position = 2)
    private String status;

    @CsvBindByPosition(position = 3)
    private BigDecimal totalAmount;

    @CsvBindByPosition(position = 4)
    private Long customerId;

    @CsvBindByPosition(position = 5)
    private Long promotionId;
}