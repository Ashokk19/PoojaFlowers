package com.floro.controller;

import com.floro.model.SubscriptionPlan;
import com.floro.service.SubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {
    
    private final SubscriptionPlanService planService;
    
    @GetMapping
    public ResponseEntity<List<SubscriptionPlan>> getAllPlans() {
        return ResponseEntity.ok(planService.getAllActivePlans());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlan> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(planService.getPlanById(id));
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<SubscriptionPlan> getPlanByCode(@PathVariable String code) {
        return ResponseEntity.ok(planService.getPlanByCode(code));
    }
}


