package com.cmc.fashion_store.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "staff")
@Getter
@Setter
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "position")
    private String position;

    @Column(name = "salary")
    private BigDecimal salary;

    @Column(name = "work_shift")
    private String workShift;
}