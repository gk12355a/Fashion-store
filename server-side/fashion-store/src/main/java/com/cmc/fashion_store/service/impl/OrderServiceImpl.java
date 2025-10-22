package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.*;
import com.cmc.fashion_store.model.*;
import com.cmc.fashion_store.repository.*;
import com.cmc.fashion_store.service.OrderService;
import com.opencsv.ICSVWriter;
import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Collections;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.io.StringWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime; // <-- 1. Thêm import
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    // --- 2. INJECT REPO CẦN THIẾT (TỪ FILE 4) ---
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;
    // ------------------------------------------

    // --- 3. IMPLEMENT PHƯƠNG THỨC MỚI (TỪ FILE 17) ---
    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(
            Pageable pageable,
            Long customerId,
            String status,
            LocalDate orderDate) {
        // Xử lý tìm kiếm theo Ngày (nếu có)
        LocalDateTime startOfDay = null;
        LocalDateTime endOfDay = null;
        if (orderDate != null) {
            startOfDay = orderDate.atStartOfDay(); // 00:00:00
            endOfDay = orderDate.atTime(LocalTime.MAX); // 23:59:59.999...
        }

        Page<Order> orderPage;

        // Xây dựng logic query phức tạp
        // (Sẽ cần các phương thức này trong OrderRepository ở file tiếp theo)
        if (customerId != null && status != null && orderDate != null) {
            orderPage = orderRepository.findByCustomerIdAndStatusContainingIgnoreCaseAndOrderDateBetween(
                    customerId, status, startOfDay, endOfDay, pageable);
        } else if (customerId != null && status != null) {
            orderPage = orderRepository.findByCustomerIdAndStatusContainingIgnoreCase(
                    customerId, status, pageable);
        } else if (customerId != null && orderDate != null) {
            orderPage = orderRepository.findByCustomerIdAndOrderDateBetween(
                    customerId, startOfDay, endOfDay, pageable);
        } else if (status != null && orderDate != null) {
            orderPage = orderRepository.findByStatusContainingIgnoreCaseAndOrderDateBetween(
                    status, startOfDay, endOfDay, pageable);
        } else if (customerId != null) {
            orderPage = orderRepository.findByCustomerId(customerId, pageable);
        } else if (status != null) {
            orderPage = orderRepository.findByStatusContainingIgnoreCase(status, pageable);
        } else if (orderDate != null) {
            orderPage = orderRepository.findByOrderDateBetween(startOfDay, endOfDay, pageable);
        } else {
            // Không có tiêu chí tìm kiếm
            orderPage = orderRepository.findAll(pageable);
        }

        return orderPage.map(this::convertOrderToDto);
    }

    // --- XUẤT BÁO CÁO (CSV) - ĐÃ CẬP NHẬT ---
    @Override
    @Transactional(readOnly = true)
    public String exportOrdersToCsv(LocalDate startDate, LocalDate endDate) throws Exception {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Vui lòng cung cấp ngày bắt đầu và ngày kết thúc.");
        }
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        List<Order> orders = orderRepository.findByOrderDateBetween(startDateTime, endDateTime);
        List<OrderExportResponse> exportDtos = orders.stream()
                .map(this::convertOrderToExportDto)
                .collect(Collectors.toList());

        try (StringWriter writer = new StringWriter()) {

            // 1. Thêm BOM (\uFEFF) cho UTF-8
            writer.write("\uFEFF");

            // --- 2. GHI HEADER TIẾNG VIỆT THỦ CÔNG ---
            // Đảm bảo thứ tự khớp với 'position' trong DTO
            writer.append("Mã Đơn Hàng").append(',')
                    .append("Ngày Đặt").append(',')
                    .append("Trạng Thái").append(',')
                    .append("Tổng Tiền (VND)").append(',')
                    .append("Mã Khách Hàng").append(',')
                    .append("Mã Khuyến Mãi")
                    .append('\n'); // Xuống dòng sau header
            // ------------------------------------------

            // 3. Xây dựng CSV Writer
            StatefulBeanToCsv<OrderExportResponse> beanToCsv = new StatefulBeanToCsvBuilder<OrderExportResponse>(writer)
                    // Quan trọng: Sử dụng NO_QUOTE_CHARACTER hoặc cấu hình quote phù hợp
                    .withQuotechar(ICSVWriter.NO_QUOTE_CHARACTER)
                    .withSeparator(',') // Dùng dấu phẩy
                    // KHÔNG cần withWriteHeader(true) vì chúng ta đã ghi header thủ công
                    .build();

            // 4. Ghi DTO (dữ liệu)
            beanToCsv.write(exportDtos);

            return writer.toString();
        }
    }

    // --- HELPER MỚI: Convert Entity (Order) -> OrderExportResponse (Giữ nguyên)
    // ---
    private OrderExportResponse convertOrderToExportDto(Order order) {
        OrderExportResponse dto = new OrderExportResponse();
        dto.setId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        if (order.getCustomer() != null) {
            dto.setCustomerId(order.getCustomer().getId());
        } else {
            dto.setCustomerId(null);
        }
        if (order.getPromotion() != null) {
            dto.setPromotionId(order.getPromotion().getId());
        } else {
            dto.setPromotionId(null);
        }
        return dto;
    }

    // --- 4. IMPLEMENT PHƯƠNG THỨC createOrder MỚI (TỪ FILE 4) ---
    @Override
    @Transactional
    public Order createOrder(CreateOrderWithDetailsRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Không tìm thấy khách hàng: " + request.getCustomerId()));

        Order newOrder = new Order();
        newOrder.setCustomer(customer);
        newOrder.setStatus("Đang chờ xử lý");
        newOrder.setTotalAmount(BigDecimal.ZERO);
        newOrder.setOrderDate(LocalDateTime.now());

        if (request.getPromotionId() != null) {
            Promotion promotion = promotionRepository.findById(request.getPromotionId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Không tìm thấy khuyến mãi: " + request.getPromotionId()));
            if (promotion.getExpiryDate() != null && promotion.getExpiryDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Khuyến mãi này đã hết hạn.");
            }
            newOrder.setPromotion(promotion);
        }

        Order savedOrder = orderRepository.save(newOrder);
        List<OrderDetail> newDetailsList = new ArrayList<>();

        for (OrderDetailItem item : request.getDetails()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Sản phẩm: " + item.getProductId()));

            int requestedQuantity = item.getQuantity();
            int currentStock = product.getStockQuantity();
            if (currentStock < requestedQuantity) {
                throw new RuntimeException(
                        "Không đủ hàng cho sản phẩm '" + product.getName() + "'. Chỉ còn " + currentStock);
            }

            product.setStockQuantity(currentStock - requestedQuantity);
            productRepository.save(product);

            OrderDetail newDetail = new OrderDetail();
            newDetail.setOrder(savedOrder);
            newDetail.setProduct(product);
            newDetail.setQuantity(requestedQuantity);
            newDetail.setUnitPrice(product.getPrice());
            newDetailsList.add(newDetail);
        }

        orderDetailRepository.saveAll(newDetailsList);
        updateOrderTotalAmount(savedOrder.getId()); // Gọi hàm helper (File 4)
        return savedOrder;
    }
    // ----------------------------------------------------

    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + id);
        }
        // TODO: Cần hoàn kho trước khi xóa
        orderRepository.deleteById(id);
    }

    // (Giữ lại hàm searchOrders cũ (File 17) để tương thích)
    @Override
    public List<OrderResponse> searchOrders(Long customerId, String status) {
        List<Order> foundOrders;
        if (customerId != null) {
            foundOrders = orderRepository.findByCustomerId(customerId);
        } else if (status != null && !status.isBlank()) {
            foundOrders = orderRepository.findByStatusContainingIgnoreCase(status);
        } else {
            foundOrders = Collections.emptyList();
        }
        return foundOrders.stream()
                .map(this::convertOrderToDto)
                .collect(Collectors.toList());
    }

    // --- 5. SỬA LẠI HÀM updateOrder (TỪ FILE 4 - ĐÃ SỬA LỖI) ---
    @Override
    @Transactional
    public Order updateOrder(Long id, UpdateOrderRequest request) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + id));

        // API này chỉ dùng để cập nhật trạng thái
        if (request.getStatus() != null) {
            // Ép kiểu từ Object sang String
            String statusString = String.valueOf(request.getStatus());
            if (!statusString.isBlank()) {
                existingOrder.setStatus(statusString);
            }
        }
        // (Không tính lại tổng tiền, vì đây chỉ là cập nhật status)
        return orderRepository.save(existingOrder);
    }
    // ----------------------------------------------------

    // --- 6. HÀM HELPER TÍNH TỔNG TIỀN (TỪ FILE 4) ---
    private void updateOrderTotalAmount(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Đơn hàng: " + orderId));

        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);
        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderDetail detail : details) {
            BigDecimal lineTotal = detail.getUnitPrice().multiply(new BigDecimal(detail.getQuantity()));
            subtotal = subtotal.add(lineTotal);
        }

        BigDecimal finalTotalAmount = subtotal;
        Promotion promotion = order.getPromotion();

        if (promotion != null) {
            if (promotion.getExpiryDate() == null || promotion.getExpiryDate().isAfter(LocalDate.now())) {
                if ("PERCENTAGE".equals(promotion.getType())) {
                    BigDecimal discountPercent = promotion.getDiscountValue().divide(new BigDecimal(100));
                    BigDecimal discountAmount = subtotal.multiply(discountPercent);
                    finalTotalAmount = subtotal.subtract(discountAmount);
                } else if ("FIXED_AMOUNT".equals(promotion.getType())) {
                    finalTotalAmount = subtotal.subtract(promotion.getDiscountValue());
                }
                if (finalTotalAmount.compareTo(BigDecimal.ZERO) < 0) {
                    finalTotalAmount = BigDecimal.ZERO;
                }
            }
        }
        order.setTotalAmount(finalTotalAmount);
        orderRepository.save(order);
    }
    // ----------------------------------------------------

    // --- 7. CÁC HÀM HELPER DTO (GIỮ NGUYÊN TỪ FILE CŨ) ---
    private OrderResponse convertOrderToDto(Order order) {
        OrderResponse orderDto = new OrderResponse();
        orderDto.setId(order.getId());
        orderDto.setOrderDate(order.getOrderDate());
        orderDto.setStatus(order.getStatus());
        orderDto.setTotalAmount(order.getTotalAmount());
        if (order.getCustomer() != null) {
            orderDto.setCustomerId(order.getCustomer().getId());
        }
        if (order.getOrderDetails() != null) {
            orderDto.setOrderDetails(
                    order.getOrderDetails().stream()
                            .map(this::convertOrderDetailToDto)
                            .collect(Collectors.toList()));
        }
        return orderDto;
    }

    private OrderDetailResponse convertOrderDetailToDto(OrderDetail orderDetail) {
        OrderDetailResponse detailDto = new OrderDetailResponse();
        detailDto.setId(orderDetail.getId());
        detailDto.setQuantity(orderDetail.getQuantity());
        detailDto.setUnitPrice(orderDetail.getUnitPrice());
        if (orderDetail.getOrder() != null) {
            detailDto.setOrderId(orderDetail.getOrder().getId());
        }
        if (orderDetail.getProduct() != null) {
            detailDto.setProductId(orderDetail.getProduct().getId());
        }
        return detailDto;
    }

}