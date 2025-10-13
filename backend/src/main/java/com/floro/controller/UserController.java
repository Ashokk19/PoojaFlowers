package com.floro.controller;

import com.floro.dto.UpdateProfileRequest;
import com.floro.model.User;
import com.floro.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String token) {
        // Extract user ID from token (simplified - in production use JWT)
        Long userId = extractUserIdFromToken(token);
        return ResponseEntity.ok(userService.getUserById(userId));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody UpdateProfileRequest request) {
        Long userId = extractUserIdFromToken(token);
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }
    
    // Simplified token extraction - replace with proper JWT parsing in production
    private Long extractUserIdFromToken(String token) {
        // Token format: "Bearer jwt-token-{userId}"
        if (token != null && token.startsWith("Bearer jwt-token-")) {
            String userIdStr = token.replace("Bearer jwt-token-", "");
            return Long.parseLong(userIdStr);
        }
        throw new RuntimeException("Invalid token");
    }
}


