package com.floro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FloroApplication {
    public static void main(String[] args) {
        SpringApplication.run(FloroApplication.class, args);
    }
}


