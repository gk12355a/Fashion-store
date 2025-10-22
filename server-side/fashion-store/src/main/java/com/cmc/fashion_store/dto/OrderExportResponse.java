package com.cmc.fashion_store.dto;

import com.opencsv.bean.CsvBindByPosition;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderExportResponse {
    @CsvBindByPosition(position = 0) // Cột 1
    private Long id;
    @CsvBindByPosition(position = 1) // Cột 2
    private LocalDateTime orderDate;
    @CsvBindByPosition(position = 2) // Cột 3
    private String status;
    @CsvBindByPosition(position = 3) // Cột 4
    private BigDecimal totalAmount;
    @CsvBindByPosition(position = 4) // Cột 5
    private Long customerId;
    @CsvBindByPosition(position = 5) // Cột 6
    private Long promotionId;
}