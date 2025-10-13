package com.floro.controller;

import com.floro.dto.SubscriptionRequest;
import com.floro.dto.SubscriptionResponse;
import com.floro.model.Subscription;
import com.floro.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    
    private final SubscriptionService subscriptionService;
    
    @PostMapping("/user/{userId}")
    public ResponseEntity<SubscriptionResponse> createSubscription(
            @PathVariable Long userId,
            @Valid @RequestBody SubscriptionRequest request) {
        System.out.println("Creating subscription for user: " + userId);
        System.out.println("Plan ID: " + request.getPlanId());
        System.out.println("Start Date: " + request.getStartDate());
        System.out.println("Auto Renew: " + request.getAutoRenew());

        Subscription subscription = subscriptionService.createSubscription(userId, request);
        System.out.println("Subscription created with ID: " + subscription.getId());
        return ResponseEntity.ok(SubscriptionResponse.fromSubscription(subscription));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SubscriptionResponse>> getUserSubscriptions(@PathVariable Long userId) {
        List<Subscription> subscriptions = subscriptionService.getUserSubscriptions(userId);
        List<SubscriptionResponse> responses = subscriptions.stream()
            .map(SubscriptionResponse::fromSubscription)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionResponse> getSubscription(@PathVariable Long id) {
        Subscription sub = subscriptionService.getSubscriptionById(id);
        return ResponseEntity.ok(SubscriptionResponse.fromSubscription(sub));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Subscription> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Subscription.SubscriptionStatus subscriptionStatus = Subscription.SubscriptionStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(subscriptionService.updateSubscriptionStatus(id, subscriptionStatus));
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid status provided: " + status);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelSubscription(@PathVariable Long id) {
        subscriptionService.cancelSubscription(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/user/{userId}/next/plan")
    public ResponseEntity<SubscriptionResponse> changeNextUpcomingPlan(
            @PathVariable Long userId,
            @RequestParam Long planId) {
        Subscription updated = subscriptionService.changeNextUpcomingPlan(userId, planId);
        return ResponseEntity.ok(SubscriptionResponse.fromSubscription(updated));
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<Void> hardDelete(@PathVariable Long id) {
        subscriptionService.hardDeleteSubscription(id);
        return ResponseEntity.noContent().build();
    }
}


