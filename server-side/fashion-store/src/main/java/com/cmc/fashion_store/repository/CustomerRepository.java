package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Tương tự như Product, JpaRepository đã cung cấp sẵn hàm findAll()
    // nên chúng ta không cần viết thêm gì ở đây.
}