package com.floro.service;

import com.floro.dto.AdminSubscriptionResponse;
import com.floro.dto.AdminUserResponse;
import com.floro.model.Subscription;
import com.floro.model.User;
import com.floro.repository.SubscriptionRepository;
import com.floro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toAdminUser)
                .collect(Collectors.toList());
    }

    public List<AdminSubscriptionResponse> getAllSubscriptions() {
        return subscriptionRepository.findAllWithUserAndPlan().stream()
                .map(this::toAdminSubscription)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminUserResponse updateUserActiveStatus(Long userId, boolean active) {
        User u = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (!active) {
            long cnt = subscriptionRepository.countByUserWithEndDateAfter(userId, LocalDate.now());
            if (cnt > 0) {
                // Use same message as delete flow for consistent popup text in UI
                throw new RuntimeException("User has active or upcoming subscriptions. Cannot delete.");
            }
        }
        u.setActive(active);
        return toAdminUser(userRepository.save(u));
    }

    @Transactional
    public void deleteUser(Long userId) {
        User u = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (Boolean.TRUE.equals(u.getActive())) {
            throw new RuntimeException("User is active. Deactivate before deleting.");
        }
        long cnt = subscriptionRepository.countByUserWithEndDateAfter(userId, LocalDate.now());
        if (cnt > 0) {
            throw new RuntimeException("User has active or upcoming subscriptions. Cannot delete.");
        }
        userRepository.delete(u);
    }

    @Transactional
    public AdminSubscriptionResponse updatePaymentStatus(Long subId, Subscription.PaymentStatus status) {
        Subscription s = subscriptionRepository.findById(subId).orElseThrow(() -> new RuntimeException("Subscription not found"));
        s.setPaymentStatus(status);
        s = subscriptionRepository.save(s);
        // Reload associations lightly from saved entity
        return toAdminSubscription(s);
    }

    private AdminUserResponse toAdminUser(User u) {
        return AdminUserResponse.builder()
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
                .referralCode(u.getReferralCode())
                .referralBonusAvailable(u.getReferralBonusAvailable())
                .referralBonusUsed(u.getReferralBonusUsed())
                .referralBonusMax(u.getReferralBonusMax())
                .referrerCodeUsed(u.getReferrerCodeUsed())
                .build();
    }

    private AdminSubscriptionResponse toAdminSubscription(Subscription s) {
        return AdminSubscriptionResponse.builder()
                .id(s.getId())
                .userId(s.getUser().getId())
                .userName(s.getUser().getName())
                .userEmail(s.getUser().getEmail())
                .userPhone(s.getUser().getPhone())
                .planCode(s.getPlan().getPlanCode())
                .planName(s.getPlan().getName())
                .status(s.getStatus().name())
                .paymentStatus(s.getPaymentStatus() != null ? s.getPaymentStatus().name() : "PENDING")
                .startDate(s.getStartDate())
                .endDate(s.getEndDate())
                .amount(s.getAmount())
                .autoRenew(s.getAutoRenew())
                .deliveryAddress(s.getDeliveryAddress())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
