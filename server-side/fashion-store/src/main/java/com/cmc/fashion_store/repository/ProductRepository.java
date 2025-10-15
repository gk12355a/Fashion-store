package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring Data JPA sẽ tự động cung cấp cho chúng ta hàm `findAll()` để lấy tất cả sản phẩm.
    // Vì vậy, ở bước này chúng ta không cần viết thêm gì cả.
}