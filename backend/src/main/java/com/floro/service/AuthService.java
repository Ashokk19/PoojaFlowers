package com.floro.service;

import com.floro.dto.AuthRequest;
import com.floro.dto.AuthResponse;
import com.floro.dto.RegisterRequest;
import com.floro.model.User;
import com.floro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    // private final JwtTokenProvider jwtTokenProvider; // To be implemented
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }
        
        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setPincode(request.getPincode());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setRole(User.UserRole.CUSTOMER);
        user.setActive(true);
        
        // If a referral code was provided, just record which code was used.
        // Bonus will be credited to referrer only after this new user makes their first purchase.
        String providedCode = request.getReferralCode();
        if (providedCode != null && !providedCode.trim().isEmpty()) {
            userRepository.findByReferralCode(providedCode.trim().toUpperCase())
                .ifPresent(referrer -> user.setReferrerCodeUsed(referrer.getReferralCode()));
        }
        
        User savedUser = userRepository.save(user);
        
        // Generate JWT token (simplified for now)
        String token = "jwt-token-" + savedUser.getId(); // TODO: Implement proper JWT
        
        com.floro.dto.AuthResponse resp = new com.floro.dto.AuthResponse();
        resp.setToken(token);
        resp.setUserId(savedUser.getId());
        resp.setName(savedUser.getName());
        resp.setEmail(savedUser.getEmail());
        resp.setRole(savedUser.getRole().name());
        resp.setPhone(savedUser.getPhone());
        resp.setAddress(savedUser.getAddress());
        resp.setPincode(savedUser.getPincode());
        resp.setCity(savedUser.getCity());
        resp.setState(savedUser.getState());
        resp.setReferralCode(savedUser.getReferralCode());
        resp.setReferralBonusAvailable(savedUser.getReferralBonusAvailable());
        resp.setReferralBonusUsed(savedUser.getReferralBonusUsed());
        resp.setReferralBonusMax(savedUser.getReferralBonusMax());
        resp.setReferrerCodeUsed(savedUser.getReferrerCodeUsed());
        return resp;
    }
    
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!user.getActive()) {
            throw new RuntimeException("Account is deactivated");
        }
        
        // Generate JWT token (simplified for now)
        String token = "jwt-token-" + user.getId(); // TODO: Implement proper JWT
        
        com.floro.dto.AuthResponse resp = new com.floro.dto.AuthResponse();
        resp.setToken(token);
        resp.setUserId(user.getId());
        resp.setName(user.getName());
        resp.setEmail(user.getEmail());
        resp.setRole(user.getRole().name());
        resp.setPhone(user.getPhone());
        resp.setAddress(user.getAddress());
        resp.setPincode(user.getPincode());
        resp.setCity(user.getCity());
        resp.setState(user.getState());
        resp.setReferralCode(user.getReferralCode());
        resp.setReferralBonusAvailable(user.getReferralBonusAvailable());
        resp.setReferralBonusUsed(user.getReferralBonusUsed());
        resp.setReferralBonusMax(user.getReferralBonusMax());
        resp.setReferrerCodeUsed(user.getReferrerCodeUsed());
        return resp;
    }
}


