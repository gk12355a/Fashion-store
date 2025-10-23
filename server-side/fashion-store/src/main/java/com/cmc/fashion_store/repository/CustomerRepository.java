package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.Customer;
import org.springframework.data.domain.Pageable; // <-- THÊM IMPORT
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- THÊM IMPORT
import org.springframework.data.repository.query.Param; // <-- THÊM IMPORT
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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
     * @param name        Customer's name
     * @param phoneNumber Customer's phone number
     * @param email       Customer's email
     * @return A list of matching customers
     */
    List<Customer> findByNameContainingIgnoreCaseOrPhoneNumberContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name, String phoneNumber, String email);

    // --- THÊM PHƯƠNG THỨC MỚI ---
    @Query("SELECT DISTINCT c.name FROM Customer c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<String> findSuggestionsByName(@Param("query") String query, Pageable pageable);

    // --- ADD THESE METHODS for Dashboard Summary ---
    /**
     * Counts the number of new customers registered within a specific date range.
     * 
     * @param startDate Start date (inclusive)
     * @param endDate   End date (exclusive)
     * @return Count of new customers.
     */
    @Query("SELECT COUNT(c.id) FROM Customer c WHERE c.registrationDate >= :startDate AND c.registrationDate < :endDate")
    Long countNewCustomersBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    // ----------------------------------------------
    // --- ADD THIS NATIVE QUERY for Weekly New Customers Chart ---
    /**
     * Counts new customers per week starting from a given date.
     * Uses YEARWEEK function specific to MySQL/MariaDB.
     * Mode 1 means the week starts on Monday.
     * @param startDate The earliest registration date to include.
     * @return A list of counts, ordered by week. The specific week number isn't returned, only the counts in order.
     */
    @Query(value = "SELECT COUNT(c.id) " +
                   "FROM customers c " +
                   "WHERE c.registration_date >= :startDate " +
                   "GROUP BY YEARWEEK(c.registration_date, 1) " + // Mode 1: Week starts Monday
                   "ORDER BY YEARWEEK(c.registration_date, 1) ASC",
           nativeQuery = true)
    List<Long> findNewCustomerCountsPerWeek(@Param("startDate") LocalDate startDate);
    // ---------------------------------------------------------
}