package com.cmc.fashion_store.config; // Or your config package

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean // This tells Spring to create and manage a ModelMapper object
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    // You might have other beans defined here already, like Cloudinary
}