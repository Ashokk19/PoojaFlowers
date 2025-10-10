package com.floro.service;

import com.floro.dto.SubscriptionRequest;
import com.floro.model.Subscription;
import com.floro.model.SubscriptionPlan;
import com.floro.model.User;
import com.floro.repository.SubscriptionPlanRepository;
import com.floro.repository.SubscriptionRepository;
import com.floro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final SubscriptionPlanRepository planRepository;
    
    @Transactional
    public Subscription createSubscription(Long userId, SubscriptionRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
            .orElseThrow(() -> new RuntimeException("Plan not found"));
        
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStartDate(request.getStartDate());
        subscription.setEndDate(request.getStartDate().plusMonths(1));
        subscription.setAmount(plan.getMonthlyPrice());
        subscription.setDeliveryAddress(request.getDeliveryAddress());
        subscription.setDeliveryInstructions(request.getDeliveryInstructions());
        subscription.setAutoRenew(request.getAutoRenew());
        subscription.setStatus(Subscription.SubscriptionStatus.PENDING);
        
        return subscriptionRepository.save(subscription);
    }
    
    public List<Subscription> getUserSubscriptions(Long userId) {
        return subscriptionRepository.findByUserId(userId);
    }
    
    public Subscription getSubscriptionById(Long id) {
        return subscriptionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Subscription not found"));
    }
    
    @Transactional
    public Subscription updateSubscriptionStatus(Long id, Subscription.SubscriptionStatus status) {
        Subscription subscription = getSubscriptionById(id);
        subscription.setStatus(status);
        return subscriptionRepository.save(subscription);
    }
    
    @Transactional
    public void cancelSubscription(Long id) {
        Subscription subscription = getSubscriptionById(id);
        subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
        subscription.setAutoRenew(false);
        subscriptionRepository.save(subscription);
    }
}


