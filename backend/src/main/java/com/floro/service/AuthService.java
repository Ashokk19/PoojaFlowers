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
        
        User savedUser = userRepository.save(user);
        
        // Generate JWT token (simplified for now)
        String token = "jwt-token-" + savedUser.getId(); // TODO: Implement proper JWT
        
        return new AuthResponse(
            token,
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getRole().name()
        );
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
        
        return new AuthResponse(
            token,
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name()
        );
    }
}


