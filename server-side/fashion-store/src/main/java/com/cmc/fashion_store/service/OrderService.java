package com.cmc.fashion_store.service;

import com.cmc.fashion_store.model.Order;
import java.util.List;

public interface OrderService {
    /**
     * Lấy danh sách tất cả đơn hàng.
     * @return danh sách Order.
     */
    List<Order> getAllOrders();
}