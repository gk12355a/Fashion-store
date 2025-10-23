package com.cmc.fashion_store.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate; // <-- Import LocalDate
import java.util.List;

@Entity
@Table(name = "customers")
@Getter
@Setter
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone_number", unique = true)
    private String phoneNumber;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "membership_type")
    private String membershipType;

    @Column(name = "reward_points")
    private int rewardPoints;

    // --- ADD THIS FIELD ---
    @Column(name = "registration_date")
    private LocalDate registrationDate; // Tracks when customer was created
    // --------------------

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Order> orders;

    // --- Add a PrePersist method to set the date automatically ---
    @PrePersist
    protected void onCreate() {
        if (registrationDate == null) { // Set only if not already set (e.g., during testing/manual insertion)
             registrationDate = LocalDate.now();
        }
    }
    // -----------------------------------------------------------
}