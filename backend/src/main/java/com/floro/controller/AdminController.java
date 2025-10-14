package com.floro.controller;

import com.floro.dto.AdminSubscriptionResponse;
import com.floro.dto.AdminUserResponse;
import com.floro.model.User;
import com.floro.service.AdminService;
import com.floro.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers(@RequestHeader("Authorization") String token) {
        assertAdmin(token);
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<List<AdminSubscriptionResponse>> getAllSubscriptions(@RequestHeader("Authorization") String token) {
        assertAdmin(token);
        return ResponseEntity.ok(adminService.getAllSubscriptions());
    }

    @PutMapping("/users/{userId}/active")
    public ResponseEntity<AdminUserResponse> setUserActive(
            @RequestHeader("Authorization") String token,
            @PathVariable Long userId,
            @RequestParam boolean active) {
        assertAdmin(token);
        return ResponseEntity.ok(adminService.updateUserActiveStatus(userId, active));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(
            @RequestHeader("Authorization") String token,
            @PathVariable Long userId) {
        assertAdmin(token);
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/subscriptions/{subId}/payment-status")
    public ResponseEntity<AdminSubscriptionResponse> setPaymentStatus(
            @RequestHeader("Authorization") String token,
            @PathVariable Long subId,
            @RequestParam String status) {
        assertAdmin(token);
        try {
            com.floro.model.Subscription.PaymentStatus ps = com.floro.model.Subscription.PaymentStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(adminService.updatePaymentStatus(subId, ps));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payment status");
        }
    }

    private void assertAdmin(String token) {
        Long userId = extractUserIdFromToken(token);
        User user = userService.getUserById(userId);
        if (user.getRole() != User.UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
    }

    private Long extractUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer jwt-token-")) {
            String userIdStr = token.replace("Bearer jwt-token-", "");
            return Long.parseLong(userIdStr);
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
    }
}
