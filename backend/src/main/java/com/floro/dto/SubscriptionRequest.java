package com.floro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SubscriptionRequest {
    
    @NotNull(message = "Plan ID is required")
    private Long planId;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
    
    private String deliveryInstructions;
    
    private Boolean autoRenew = true;
    
    // Optional: use one referral bonus for 10% discount on this subscription
    private Boolean useReferralBonus = false;
}


