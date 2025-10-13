package com.floro.controller;

import com.floro.model.SubscriptionPlan;
import com.floro.service.SubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {
    
    private final SubscriptionPlanService planService;
    
    @GetMapping
    public ResponseEntity<List<SubscriptionPlan>> getAllPlans() {
        try {
            System.out.println("Getting all active plans...");
            List<SubscriptionPlan> plans = planService.getAllActivePlans();
            System.out.println("Found " + plans.size() + " active plans");
            for (SubscriptionPlan plan : plans) {
                System.out.println("- Plan: " + plan.getPlanCode() + " (" + plan.getName() + ")");
            }
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            System.out.println("Error getting all plans: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlan> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(planService.getPlanById(id));
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<SubscriptionPlan> getPlanByCode(@PathVariable String code) {
        try {
            System.out.println("Looking for plan with code: " + code);
            SubscriptionPlan plan = planService.getPlanByCode(code);
            System.out.println("Found plan: " + plan.getName());
            return ResponseEntity.ok(plan);
        } catch (RuntimeException e) {
            System.out.println("Error finding plan with code " + code + ": " + e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.out.println("Unexpected error finding plan with code " + code + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debugPlans() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<SubscriptionPlan> allPlans = planService.getAllActivePlans();
            response.put("totalPlans", allPlans.size());
            response.put("plans", allPlans.stream().map(p -> Map.of(
                "id", p.getId(),
                "code", p.getPlanCode(),
                "name", p.getName(),
                "price", p.getMonthlyPrice()
            )).toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}


