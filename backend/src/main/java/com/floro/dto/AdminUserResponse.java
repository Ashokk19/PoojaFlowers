package com.floro.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private Boolean active;
    private Boolean emailVerified;
    private String address;
    private String pincode;
    private String city;
    private String state;
    private LocalDateTime createdAt;
}
