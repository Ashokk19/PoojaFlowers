package com.floro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String phone;
    private String address;
    private String pincode;
    private String city;
    private String state;
    
    public AuthResponse(String token, Long userId, String name, String email, String role) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }
    
    public AuthResponse(String token, Long userId, String name, String email, String role,
                       String phone, String address, String pincode, String city, String state) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.address = address;
        this.pincode = pincode;
        this.city = city;
        this.state = state;
    }
}


