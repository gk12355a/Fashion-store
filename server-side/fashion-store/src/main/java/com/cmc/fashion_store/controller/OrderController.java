package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreateOrderWithDetailsRequest; // <-- 1. Import DTO mới
import com.cmc.fashion_store.dto.UpdateOrderRequest;
import com.cmc.fashion_store.dto.OrderResponse;
import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat; // <-- 2. Thêm import
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/orders") // -> /api/v1/orders
public class OrderController {

    @Autowired
    private OrderService orderService;

    // --- 4. THAY ĐỔI ENDPOINT GETALL ---
    /**
     * Lấy danh sách đơn hàng (có phân trang VÀ tìm kiếm)
     *
     * @param pageable   Phân trang (page, size, sort)
     * @param customerId Lọc theo Mã Khách hàng (tùy chọn)
     * @param status     Lọc theo Trạng thái (tùy chọn)
     * @param orderDate  Lọc theo Ngày (tùy chọn, định dạng YYYY-MM-DD)
     * @return Trang (Page) các Đơn hàng (DTO)
     */
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
    // ------------------------------------------

    // --- 5. THAY ĐỔI ENDPOINT CREATE (TỪ FILE 5) ---
    /**
     * Tạo một đơn hàng mới (bao gồm cả chi tiết đơn hàng).
     */
    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderWithDetailsRequest request) {
        Order createdOrder = orderService.createOrder(request);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }
    // ------------------------------------------

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // (Giữ lại endpoint /search cũ để tương thích với logic cũ (File 16))
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
    /**
     * Endpoint xuất báo cáo đơn hàng ra file CSV.
     * Yêu cầu startDate và endDate theo định dạng YYYY-MM-DD.
     */
    @GetMapping("/export")
    public ResponseEntity<String> exportOrdersAsCsv(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        try {
            // 1. Gọi Service để lấy chuỗi CSV
            String csvData = orderService.exportOrdersToCsv(startDate, endDate);
            
            // 2. Tạo tên file động
            String filename = String.format("BaoCao_DonHang_tu_%s_den_%s.csv", 
                startDate.format(DateTimeFormatter.ISO_DATE), 
                endDate.format(DateTimeFormatter.ISO_DATE));
            
            // 3. Thiết lập HTTP Headers cho việc tải file
            HttpHeaders headers = new HttpHeaders();
            // Header báo trình duyệt tải file về với tên đã định
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
            // Header báo kiểu nội dung là CSV và mã hóa UTF-8
            headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));

            // 4. Trả về Response với dữ liệu CSV, Headers và Status OK
            return new ResponseEntity<>(csvData, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            // Trả về lỗi nếu có vấn đề
            return new ResponseEntity<>(
                "Lỗi khi xuất CSV: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}