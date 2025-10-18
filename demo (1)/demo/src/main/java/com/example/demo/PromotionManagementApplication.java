package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PromotionManagementApplication implements CommandLineRunner {

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    public static void main(String[] args) {
        SpringApplication.run(PromotionManagementApplication.class, args);
    }

    @Override
    public void run(String... args) {
        System.out.println(">>> DB username: " + username);
        System.out.println(">>> DB password: " + password);
    }
}
