package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreateOrderWithDetailsRequest;
import com.cmc.fashion_store.dto.UpdateOrderRequest;
import com.cmc.fashion_store.dto.OrderResponse;
import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat; 

// --- CÁC IMPORT BỊ THIẾU GÂY LỖI ---
import org.springframework.http.HttpHeaders;     // <-- 1. Sửa lỗi HttpHeaders(), CONTENT_DISPOSITION
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;       // <-- 2. Thêm import này để dùng cho CONTENT_TYPE
import org.springframework.http.ResponseEntity;
// ------------------------------------

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springdoc.core.annotations.ParameterObject;

import java.time.LocalDate; 
import java.time.format.DateTimeFormatter; // <-- 3. Import này sẽ hết bị báo "never used"
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
    // --- 4. ENDPOINT XUẤT BÁO CÁO (CSV) ---
    @GetMapping("/export")
    public ResponseEntity<String> exportOrdersAsCsv(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        try {
            String csvData = orderService.exportOrdersToCsv(startDate, endDate);
            
            // Tạo tên file (Giờ DateTimeFormatter sẽ được sử dụng)
            String filename = String.format("BaoCao_DonHang_tu_%s_den_%s.csv", 
                startDate.format(DateTimeFormatter.ISO_DATE), 
                endDate.format(DateTimeFormatter.ISO_DATE));
            
            // Tạo headers (Giờ HttpHeaders() sẽ hoạt động)
            HttpHeaders headers = new HttpHeaders();
            
            // Sửa lỗi CONTENT_DISPOSITION
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
            
            // Sửa lỗi CONTENT_TYPE (dùng MediaType cho an toàn)
            headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));

            // Sửa lỗi "Cannot infer type arguments"
            return new ResponseEntity<>(csvData, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(
                "Lỗi khi xuất CSV: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
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
}