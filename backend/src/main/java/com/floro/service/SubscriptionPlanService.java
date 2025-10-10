package com.floro.service;

import com.floro.model.SubscriptionPlan;
import com.floro.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanService {
    
    private final SubscriptionPlanRepository planRepository;
    
    public List<SubscriptionPlan> getAllActivePlans() {
        return planRepository.findByActiveTrue();
    }
    
    public SubscriptionPlan getPlanById(Long id) {
        return planRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Plan not found"));
    }
    
    public SubscriptionPlan getPlanByCode(String code) {
        return planRepository.findByPlanCode(code)
            .orElseThrow(() -> new RuntimeException("Plan not found"));
    }
}


