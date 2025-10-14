package com.floro.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminSubscriptionResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private String planCode;
    private String planName;
    private String status;
    private String paymentStatus;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal amount;
    private Boolean autoRenew;
    private String deliveryAddress;
    private LocalDateTime createdAt;
}
