package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.Customer;
import org.springframework.data.domain.Pageable; // <-- THÊM IMPORT
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- THÊM IMPORT
import org.springframework.data.repository.query.Param; // <-- THÊM IMPORT
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Tương tự như Product, JpaRepository đã cung cấp sẵn hàm findAll()
    // nên chúng ta không cần viết thêm gì ở đây.
    /**
     * Finds customers by name, phone number, or email.
     * 'Containing' is equivalent to the LIKE '%...%' clause.
     * 'IgnoreCase' makes the search case-insensitive.
     *
     * @param name Customer's name
     * @param phoneNumber Customer's phone number
     * @param email Customer's email
     * @return A list of matching customers
     */
    List<Customer> findByNameContainingIgnoreCaseOrPhoneNumberContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name, String phoneNumber, String email
    );
    // --- THÊM PHƯƠNG THỨC MỚI ---
    @Query("SELECT DISTINCT c.name FROM Customer c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<String> findSuggestionsByName(@Param("query") String query, Pageable pageable);

}