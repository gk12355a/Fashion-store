package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.*; // Assuming OrderDetailItem is in here
import com.cmc.fashion_store.model.*;
import com.cmc.fashion_store.repository.*;
import com.cmc.fashion_store.service.OrderDetailService; // Import OrderDetailService
import com.cmc.fashion_store.service.OrderService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
// import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*; // Import Map and Optional
import java.util.stream.Collectors;
// import java.util.stream.IntStream;

@Service
@Transactional(readOnly = true) // Default transaction mode is read-only
public class OrderServiceImpl implements OrderService {

    // --- Repositories and Services ---
    @Autowired private OrderRepository orderRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private PromotionRepository promotionRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderDetailRepository orderDetailRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private OrderDetailService orderDetailService; // Service to handle detail logic

    // --- Formatters ---
    private static final DateTimeFormatter CSV_DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    // --- GET ALL ORDERS (with Filtering - Requires Repository Methods or Specifications) ---
    @Override
    public Page<OrderResponse> getAllOrders(Pageable pageable, Long customerId, String status, LocalDate orderDate) {
        LocalDateTime startOfDay = null;
        LocalDateTime endOfDay = null;
        if (orderDate != null) {
            startOfDay = orderDate.atStartOfDay();
            endOfDay = orderDate.plusDays(1).atStartOfDay(); // Exclusive end date
        }

        Page<Order> orderPage;

        // !! IMPORTANT: Implement the corresponding methods in OrderRepository
        // !! OR use JPA Specifications for robust filtering.
        // !! The current fallback ignores filters if specific methods are missing.
        boolean hasCustomerId = customerId != null;
        boolean hasStatus = status != null && !status.isBlank();
        boolean hasDate = orderDate != null;

        try {
            if (hasCustomerId && hasStatus && hasDate) {
                orderPage = orderRepository.findByCustomerIdAndStatusContainingIgnoreCaseAndOrderDateBetween(
                        customerId, status, startOfDay, endOfDay, pageable);
            } else if (hasCustomerId && hasDate) {
                orderPage = orderRepository.findByCustomerIdAndOrderDateBetween(
                        customerId, startOfDay, endOfDay, pageable);
            } else if (hasStatus && hasDate) {
                orderPage = orderRepository.findByStatusContainingIgnoreCaseAndOrderDateBetween(
                        status, startOfDay, endOfDay, pageable);
            } else if (hasDate) {
                orderPage = orderRepository.findByOrderDateBetween(
                        startOfDay, endOfDay, pageable);
            } else if (hasCustomerId) {
                 // Requires: Page<Order> findByCustomerId(Long customerId, Pageable pageable);
                orderPage = orderRepository.findByCustomerId(customerId, pageable);
            } else if (hasStatus) {
                 // Requires: Page<Order> findByStatusContainingIgnoreCase(String status, Pageable pageable);
                orderPage = orderRepository.findByStatusContainingIgnoreCase(status, pageable);
            } else {
                orderPage = orderRepository.findAll(pageable);
            }
        } catch (Exception e) {
             System.err.println("WARN: Error during filtered order fetch (Repository method might be missing). Falling back to findAll. Error: " + e.getMessage());
             orderPage = orderRepository.findAll(pageable); // Fallback
        }


        return orderPage.map(this::convertOrderToDto);
    }

    // --- CREATE ORDER (Using OrderDetailService) ---
    @Override
    @Transactional // Override readOnly to allow modifications
    public Order createOrder(CreateOrderWithDetailsRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException("Customer not found: " + request.getCustomerId()));

        Order newOrder = new Order();
        newOrder.setCustomer(customer);
        newOrder.setStatus("Đang chờ xử lý"); // Default status
        newOrder.setTotalAmount(BigDecimal.ZERO); // Initial total
        newOrder.setOrderDate(LocalDateTime.now());

        // Assign promotion if provided and valid
        if (request.getPromotionId() != null) {
            Promotion promotion = promotionRepository.findById(request.getPromotionId())
                    .orElseThrow(() -> new EntityNotFoundException("Promotion not found: " + request.getPromotionId()));
            if (promotion.getExpiryDate() != null && promotion.getExpiryDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Promotion has expired.");
            }
            newOrder.setPromotion(promotion);
        }

        // Save Order first to get the ID
        Order savedOrder = orderRepository.save(newOrder);

        // Create Order Details using OrderDetailService (handles stock, price, total update)
        if (request.getDetails() != null) {
            for (OrderDetailItem item : request.getDetails()) {
                CreateOrderDetailRequest detailRequest = new CreateOrderDetailRequest();
                detailRequest.setOrderId(savedOrder.getId());
                detailRequest.setProductId(item.getProductId());
                detailRequest.setQuantity(item.getQuantity());
                // **IMPORTANT**: CreateOrderDetailRequest should NOT have unitPrice.
                // OrderDetailService MUST fetch the price from ProductRepository.
                orderDetailService.createOrderDetail(detailRequest);
            }
        }

        // Fetch the order again to get the final state with updated totalAmount
        return orderRepository.findById(savedOrder.getId())
                .orElseThrow(() -> new RuntimeException("Failed to reload order after creation: " + savedOrder.getId()));
    }

    // --- DELETE ORDER (With Stock Return) ---
    @Override
    @Transactional // Override readOnly
    public void deleteOrder(Long id) {
        Order orderToDelete = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));

        // 1. Check for associated payments BEFORE deleting
        List<Payment> payments = paymentRepository.findByOrderId(id);
        if (!payments.isEmpty()) {
            throw new IllegalStateException("Cannot delete an order that has payments associated. Order ID: " + id);
        }

        // 2. Return stock for associated order details
        List<OrderDetail> details = orderDetailRepository.findByOrderId(id); // Fetch details
        for (OrderDetail detail : details) {
            Product product = detail.getProduct();
            if (product != null) {
                int returnedQuantity = detail.getQuantity();
                product.setStockQuantity(product.getStockQuantity() + returnedQuantity);
                productRepository.save(product); // Update product stock
            }
        }

        // 3. Delete the order (CascadeType.ALL on orderDetails will handle detail deletion)
        orderRepository.delete(orderToDelete);
    }

    // --- SEARCH ORDERS (Legacy/Simple Search - Requires Repository Methods) ---
    @Override
    public List<OrderResponse> searchOrders(Long customerId, String status) {
        List<Order> foundOrders;
        // !! IMPORTANT: Add findByCustomerId and findByStatusContainingIgnoreCase to OrderRepository
        try {
            if (customerId != null) {
                 foundOrders = orderRepository.findByCustomerId(customerId); // Assumes method exists
            } else if (status != null && !status.isBlank()) {
                foundOrders = orderRepository.findByStatusContainingIgnoreCase(status); // Assumes method exists
            } else {
                foundOrders = Collections.emptyList();
            }
        } catch(Exception e) {
             System.err.println("WARN: Error during order search (Repository method might be missing). Returning empty list. Error: " + e.getMessage());
             foundOrders = Collections.emptyList(); // Fallback
        }

        return foundOrders.stream()
                .map(this::convertOrderToDto)
                .collect(Collectors.toList());
    }

    // --- UPDATE ORDER (Only Status) ---
    @Override
    @Transactional // Override readOnly=true
    public Order updateOrder(Long id, UpdateOrderRequest request) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + id));

        // API này chỉ dùng để cập nhật trạng thái
        // Use the String directly now
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
             existingOrder.setStatus(request.getStatus()); // This will now work correctly
        }

        // (Không tính lại tổng tiền, vì đây chỉ là cập nhật status)
        return orderRepository.save(existingOrder);
    }
    // --- EXPORT ORDERS TO CSV (Optimized) ---
    @Override
    public String exportOrdersToCsv(LocalDate startDate, LocalDate endDate) throws Exception {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay(); // Exclusive end

        // 1. Fetch Orders with Customer and Promotion eagerly
        List<Order> orders = orderRepository.findOrdersForReport(startDateTime, endDateTime);
        if (orders.isEmpty()) {
            return "\ufeffKhông có đơn hàng nào trong khoảng thời gian đã chọn.\n"; // BOM + Message
        }

        List<Long> orderIds = orders.stream().map(Order::getId).collect(Collectors.toList());

        // 2. Fetch all relevant OrderDetails efficiently
        // !! REQUIRES: List<OrderDetail> findByOrderIdIn(List<Long> orderIds); in OrderDetailRepository
        Map<Long, List<OrderDetail>> detailsMap = orderDetailRepository.findByOrderIdIn(orderIds)
                .stream()
                .collect(Collectors.groupingBy(od -> od.getOrder().getId()));

        // 3. Fetch all relevant Payments (with Staff) efficiently
        // !! REQUIRES: @Query("SELECT p FROM Payment p LEFT JOIN FETCH p.staff WHERE p.order.id IN :orderIds")
        // !!           List<Payment> findByOrderIdInWithStaff(@Param("orderIds") List<Long> orderIds); in PaymentRepository
        Map<Long, Payment> paymentMap = paymentRepository.findByOrderIdInWithStaff(orderIds)
                .stream()
                .collect(Collectors.toMap(p -> p.getOrder().getId(), p -> p, (existing, replacement) -> existing)); // Take first payment if multiple

        // 4. Build CSV String
        StringBuilder csvBuilder = new StringBuilder();
        csvBuilder.append('\ufeff'); // UTF-8 BOM
        csvBuilder.append("MaDonHang,NgayDat,MaKhachHang,TenKhachHang,SoDienThoaiKH,EmailKH,TrangThai,TongTienGoc,MaKhuyenMai,TenKhuyenMai,GiaTriKhuyenMai,LoaiKhuyenMai,TongTienThanhToan,NgayThanhToan,PhuongThucThanhToan,MaNhanVien,TenNhanVien\n");

        for (Order order : orders) {
            // Get basic info
            Long maDonHang = order.getId();
            String ngayDat = order.getOrderDate() != null ? order.getOrderDate().format(CSV_DATE_TIME_FORMATTER) : "";
            Customer customer = order.getCustomer();
            Long maKhachHang = customer != null ? customer.getId() : null;
            String tenKhachHang = customer != null ? escapeCsv(customer.getName()) : "";
            String soDienThoaiKH = customer != null ? escapeCsv(customer.getPhoneNumber()) : "";
            String emailKH = customer != null ? escapeCsv(customer.getEmail()) : "";
            String trangThai = escapeCsv(order.getStatus());
            BigDecimal tongTienThanhToan = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
            Promotion promotion = order.getPromotion();
            Long maKhuyenMai = promotion != null ? promotion.getId() : null;
            String tenKhuyenMai = promotion != null ? escapeCsv(promotion.getName()) : "";
            BigDecimal giaTriKhuyenMai = promotion != null ? promotion.getDiscountValue() : null;
            String loaiKhuyenMai = promotion != null ? escapeCsv(promotion.getType()) : "";

            // Calculate Subtotal (sum of details before discount)
            BigDecimal tongTienGoc = BigDecimal.ZERO;
            List<OrderDetail> details = detailsMap.getOrDefault(maDonHang, Collections.emptyList());
            for (OrderDetail detail : details) {
                 if (detail.getUnitPrice() != null && detail.getQuantity() > 0) {
                     tongTienGoc = tongTienGoc.add(detail.getUnitPrice().multiply(BigDecimal.valueOf(detail.getQuantity())));
                 }
            }

            // Get Payment and Staff info
            Payment payment = paymentMap.get(maDonHang);
            String ngayThanhToan = "";
            String phuongThucThanhToan = "";
            Long maNhanVien = null;
            String tenNhanVien = "";
            if (payment != null) {
                ngayThanhToan = payment.getPaymentDate() != null ? payment.getPaymentDate().format(CSV_DATE_TIME_FORMATTER) : "";
                phuongThucThanhToan = escapeCsv(payment.getPaymentMethod());
                Staff staff = payment.getStaff(); // Staff was eagerly fetched
                if (staff != null) {
                    maNhanVien = staff.getId();
                    tenNhanVien = escapeCsv(staff.getName());
                }
            }

            // Append row to CSV
            csvBuilder.append(maDonHang).append(",")
                      .append(ngayDat).append(",")
                      .append(maKhachHang != null ? maKhachHang : "").append(",")
                      .append(tenKhachHang).append(",")
                      .append(soDienThoaiKH).append(",")
                      .append(emailKH).append(",")
                      .append(trangThai).append(",")
                      .append(tongTienGoc).append(",")
                      .append(maKhuyenMai != null ? maKhuyenMai : "").append(",")
                      .append(tenKhuyenMai).append(",")
                      .append(giaTriKhuyenMai != null ? giaTriKhuyenMai : "").append(",")
                      .append(loaiKhuyenMai).append(",")
                      .append(tongTienThanhToan).append(",")
                      .append(ngayThanhToan).append(",")
                      .append(phuongThucThanhToan).append(",")
                      .append(maNhanVien != null ? maNhanVien : "").append(",")
                      .append(tenNhanVien).append("\n");
        }

        return csvBuilder.toString();
    }

    // --- HELPER METHODS ---

    // Escapes CSV special characters
    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n") || value.contains("\r")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    // Converts Order Entity to OrderResponse DTO (used by getAllOrders, searchOrders)
    private OrderResponse convertOrderToDto(Order order) {
        OrderResponse dto = new OrderResponse();
        dto.setId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        if (order.getCustomer() != null) {
            dto.setCustomerId(order.getCustomer().getId());
            // Optionally add customer name if OrderResponse needs it
            // dto.setCustomerName(order.getCustomer().getName());
        }
        if (order.getPromotion() != null) {
             dto.setPromotionId(order.getPromotion().getId());
             // Optionally add promotion name if OrderResponse needs it
             // dto.setPromotionName(order.getPromotion().getName());
        }
        // Optionally map details if OrderResponse needs them (might cause performance issues if large)
        // if (order.getOrderDetails() != null) {
        //    dto.setOrderDetails(order.getOrderDetails().stream().map(this::convertOrderDetailToDto).collect(Collectors.toList()));
        // }
        return dto;
    }

    // Converts OrderDetail Entity to OrderDetailResponse DTO (if needed by convertOrderToDto)
    // private OrderDetailResponse convertOrderDetailToDto(OrderDetail orderDetail) {
    //     OrderDetailResponse detailDto = new OrderDetailResponse();
    //     detailDto.setId(orderDetail.getId());
    //     detailDto.setQuantity(orderDetail.getQuantity());
    //     detailDto.setUnitPrice(orderDetail.getUnitPrice());
    //     if (orderDetail.getOrder() != null) {
    //         detailDto.setOrderId(orderDetail.getOrder().getId());
    //     }
    //     if (orderDetail.getProduct() != null) {
    //         detailDto.setProductId(orderDetail.getProduct().getId());
    //     }
    //     return detailDto;
    // }

    // Helper to update total amount (called by OrderDetailService) - Keep this logic here or move to OrderDetailService
    // **NOTE:** If OrderDetailService calls this, it needs OrderRepository injected.
    // Consider moving this logic *entirely* into OrderDetailServiceImpl.
    // private void updateOrderTotalAmount(Long orderId) {
    //     Order order = orderRepository.findById(orderId)
    //             .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

    //     List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);
    //     BigDecimal subtotal = BigDecimal.ZERO;
    //     for (OrderDetail detail : details) {
    //         if (detail.getUnitPrice() != null && detail.getQuantity() > 0) {
    //              subtotal = subtotal.add(detail.getUnitPrice().multiply(BigDecimal.valueOf(detail.getQuantity())));
    //         }
    //     }

    //     BigDecimal finalTotalAmount = subtotal;
    //     Promotion promotion = order.getPromotion();

    //     if (promotion != null) {
    //         // Check expiry date
    //         if (promotion.getExpiryDate() == null || !promotion.getExpiryDate().isBefore(LocalDate.now())) {
    //             if ("PERCENTAGE".equals(promotion.getType()) && promotion.getDiscountValue() != null) {
    //                 BigDecimal discountPercent = promotion.getDiscountValue().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
    //                 BigDecimal discountAmount = subtotal.multiply(discountPercent);
    //                 finalTotalAmount = subtotal.subtract(discountAmount);
    //             } else if ("FIXED_AMOUNT".equals(promotion.getType()) && promotion.getDiscountValue() != null) {
    //                 finalTotalAmount = subtotal.subtract(promotion.getDiscountValue());
    //             }
    //             // Ensure total doesn't go below zero
    //             if (finalTotalAmount.compareTo(BigDecimal.ZERO) < 0) {
    //                 finalTotalAmount = BigDecimal.ZERO;
    //             }
    //         }
    //         // If expired, finalTotalAmount remains subtotal
    //     }
    //     order.setTotalAmount(finalTotalAmount);
    //     orderRepository.save(order);
    // }
}

// --- REMINDER: ADD THESE METHODS TO YOUR REPOSITORIES ---

// In OrderDetailRepository.java:
// List<OrderDetail> findByOrderIdIn(List<Long> orderIds);

// In PaymentRepository.java:
// @Query("SELECT p FROM Payment p LEFT JOIN FETCH p.staff s WHERE p.order.id IN :orderIds")
// List<Payment> findByOrderIdInWithStaff(@Param("orderIds") List<Long> orderIds);

// In OrderRepository.java:
// List<Order> findByCustomerId(Long customerId);
// List<Order> findByStatusContainingIgnoreCase(String status);
// Page<Order> findByCustomerId(Long customerId, Pageable pageable);
// Page<Order> findByStatusContainingIgnoreCase(String status, Pageable pageable);
// Page<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
// Page<Order> findByCustomerIdAndOrderDateBetween(Long customerId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
// Page<Order> findByStatusContainingIgnoreCaseAndOrderDateBetween(String status, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
// Page<Order> findByCustomerIdAndStatusContainingIgnoreCaseAndOrderDateBetween(Long customerId, String status, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
// @Query("SELECT o FROM Order o LEFT JOIN FETCH o.customer c LEFT JOIN FETCH o.promotion p WHERE o.orderDate >= :startDate AND o.orderDate < :endDate ORDER BY o.orderDate ASC")
// List<Order> findOrdersForReport(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);