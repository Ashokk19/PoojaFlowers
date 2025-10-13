package com.floro.service;

import com.floro.dto.AdminSubscriptionResponse;
import com.floro.dto.AdminUserResponse;
import com.floro.model.Subscription;
import com.floro.model.User;
import com.floro.repository.SubscriptionRepository;
import com.floro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> AdminUserResponse.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .phone(u.getPhone())
                        .role(u.getRole().name())
                        .active(u.getActive())
                        .emailVerified(u.getEmailVerified())
                        .address(u.getAddress())
                        .pincode(u.getPincode())
                        .city(u.getCity())
                        .state(u.getState())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<AdminSubscriptionResponse> getAllSubscriptions() {
        return subscriptionRepository.findAllWithUserAndPlan().stream()
                .map(s -> AdminSubscriptionResponse.builder()
                        .id(s.getId())
                        .userId(s.getUser().getId())
                        .userName(s.getUser().getName())
                        .userEmail(s.getUser().getEmail())
                        .userPhone(s.getUser().getPhone())
                        .planCode(s.getPlan().getPlanCode())
                        .planName(s.getPlan().getName())
                        .status(s.getStatus().name())
                        .startDate(s.getStartDate())
                        .endDate(s.getEndDate())
                        .amount(s.getAmount())
                        .autoRenew(s.getAutoRenew())
                        .deliveryAddress(s.getDeliveryAddress())
                        .createdAt(s.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
