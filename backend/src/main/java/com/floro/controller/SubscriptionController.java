package com.floro.controller;

import com.floro.dto.SubscriptionRequest;
import com.floro.model.Subscription;
import com.floro.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    
    private final SubscriptionService subscriptionService;
    
    @PostMapping("/user/{userId}")
    public ResponseEntity<Subscription> createSubscription(
            @PathVariable Long userId,
            @Valid @RequestBody SubscriptionRequest request) {
        return ResponseEntity.ok(subscriptionService.createSubscription(userId, request));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Subscription>> getUserSubscriptions(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.getUserSubscriptions(userId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionById(id));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Subscription> updateStatus(
            @PathVariable Long id,
            @RequestParam Subscription.SubscriptionStatus status) {
        return ResponseEntity.ok(subscriptionService.updateSubscriptionStatus(id, status));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelSubscription(@PathVariable Long id) {
        subscriptionService.cancelSubscription(id);
        return ResponseEntity.noContent().build();
    }
}


