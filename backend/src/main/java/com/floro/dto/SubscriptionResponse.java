package com.floro.dto;

import com.floro.model.Subscription;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {
    private Long id;
    private String planCode;
    private String planName;
    private String status;
    private String duration;
    private LocalDate startDate;
    private LocalDate endDate;
    private String deliveryTime;
    private BigDecimal amount;
    private String deliveryAddress;
    private Boolean autoRenew;
    private Boolean current;
    private String referralCode;
    
    public static SubscriptionResponse fromSubscription(Subscription subscription) {
        // Calculate duration from start and end dates
        String duration = calculateDuration(subscription.getStartDate(), subscription.getEndDate());
        
        return SubscriptionResponse.builder()
            .id(subscription.getId())
            .planCode(subscription.getPlan().getPlanCode())
            .planName(subscription.getPlan().getName())
            .status(subscription.getStatus().toString())
            .duration(duration)
            .startDate(subscription.getStartDate())
            .endDate(subscription.getEndDate())
            .deliveryTime(subscription.getDeliveryTime() != null ? subscription.getDeliveryTime() : "6:00 AM - 7:00 AM")
            .amount(subscription.getAmount())
            .deliveryAddress(subscription.getDeliveryAddress())
            .autoRenew(subscription.getAutoRenew())
            .current(Boolean.TRUE.equals(subscription.getCurrent()))
            .referralCode(subscription.getUser() != null ? subscription.getUser().getReferralCode() : null)
            .build();
    }
    
    private static String calculateDuration(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return "Monthly"; // Default
        }
        
        Period period = Period.between(startDate, endDate);
        int months = period.getMonths() + (period.getYears() * 12);
        
        if (months <= 1) {
            return "Monthly";
        } else if (months <= 3) {
            return "Quarterly";
        } else if (months <= 6) {
            return "Half-Yearly";
        } else {
            return "Yearly";
        }
    }
}

