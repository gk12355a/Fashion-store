package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreateOrderWithDetailsRequest;
import com.cmc.fashion_store.dto.UpdateOrderRequest;
import com.cmc.fashion_store.dto.OrderResponse;
import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType; // Correct MediaType import
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springdoc.core.annotations.ParameterObject;

import java.net.URLEncoder; // Import URLEncoder
import java.nio.charset.StandardCharsets; // Import StandardCharsets
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate orderDate
    ) {
        Page<OrderResponse> ordersPage = orderService.getAllOrders(pageable, customerId, status, orderDate);
        return ResponseEntity.ok(ordersPage);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderWithDetailsRequest request) {
        Order createdOrder = orderService.createOrder(request);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<OrderResponse>> searchOrders(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) String status) {
        List<OrderResponse> orders = orderService.searchOrders(customerId, status);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @Valid @RequestBody UpdateOrderRequest request) {
        Order updatedOrder = orderService.updateOrder(id, request);
        return ResponseEntity.ok(updatedOrder);
    }

    // --- REMOVED THE DUPLICATE METHOD ---
    // Kept the version that handles filename encoding better

    /**
     * Endpoint to export order reports to CSV file.
     * Requires startDate and endDate in YYYY-MM-DD format.
     */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportOrdersAsCsv( // <-- 1. Đổi kiểu trả về thành byte[]
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        try {
            // 2. Lấy chuỗi CSV (đã có BOM) từ Service
            String csvData = orderService.exportOrdersToCsv(startDate, endDate);

            // 3. Tạo tên file động và mã hóa chuẩn RFC 5987
            String filename = String.format("BaoCao_DonHang_tu_%s_den_%s.csv",
                    startDate.format(DateTimeFormatter.ISO_DATE),
                    endDate.format(DateTimeFormatter.ISO_DATE));
            String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8.toString()).replace("+", "%20");

            // 4. Thiết lập Headers
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFilename);
            headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8")); // Vẫn khai báo UTF-8

            // 5. Chuyển chuỗi CSV sang byte array DÙNG UTF-8
            byte[] csvBytes = csvData.getBytes(StandardCharsets.UTF_8);

            // 6. Trả về ResponseEntity<byte[]>
            return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            System.err.println("Error exporting CSV: " + e.getMessage());
            // Trả về lỗi (có thể dạng JSON nếu muốn)
             HttpHeaders errorHeaders = new HttpHeaders();
            errorHeaders.setContentType(MediaType.APPLICATION_JSON);
            String errorBody = "{\"error\": \"Lỗi khi xuất CSV: " + e.getMessage().replace("\"", "'") + "\"}";
            return new ResponseEntity<>(errorBody.getBytes(StandardCharsets.UTF_8), errorHeaders, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}