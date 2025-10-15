package com.cmc.fashion_store.service;

import com.cmc.fashion_store.model.Product;
import java.util.List;

public interface ProductService {
    /**
     * Lấy danh sách tất cả sản phẩm.
     * @return danh sách Product.
     */
    List<Product> getAllProducts();
}