package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.CreateOrderRequest; // Import DTO
import com.cmc.fashion_store.model.Order;
import java.util.List;

public interface OrderService {
    /**
     * Lấy danh sách tất cả đơn hàng.
     * @return danh sách Order.
     */
    List<Order> getAllOrders();
    /**
     * Tạo một đơn hàng mới.
     * @param request thông tin đơn hàng mới.
     * @return Order đã được tạo.
     */
    Order createOrder(CreateOrderRequest request);
}