package com.floro.service;

import com.floro.dto.UpdateProfileRequest;
import com.floro.model.User;
import com.floro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @Transactional
    public User updateProfile(Long userId, UpdateProfileRequest request) {
        User user = getUserById(userId);
        
        // Check if phone number is being changed and already exists
        if (!user.getPhone().equals(request.getPhone()) && 
            userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already in use");
        }
        
        // Update user fields
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setPincode(request.getPincode());
        user.setCity(request.getCity());
        user.setState(request.getState());
        
        return userRepository.save(user);
    }
}


