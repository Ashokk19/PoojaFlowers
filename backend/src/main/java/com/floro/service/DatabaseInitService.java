package com.floro.service;

import com.floro.model.SubscriptionPlan;
import com.floro.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DatabaseInitService implements CommandLineRunner {
    
    private final SubscriptionPlanRepository planRepository;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔍 Checking database initialization...");
        
        // Check if plans exist
        long planCount = planRepository.count();
        System.out.println("📊 Found " + planCount + " subscription plans in database");
        
        if (planCount == 0) {
            System.out.println("⚠️ No subscription plans found. Initializing database...");
            initializePlans();
        } else {
            System.out.println("✅ Database already initialized with " + planCount + " plans");
        }
    }
    
    private void initializePlans() {
        try {
            // Value Plan
            SubscriptionPlan valuePlan = new SubscriptionPlan();
            valuePlan.setPlanCode("value");
            valuePlan.setName("Value");
            valuePlan.setDescription("Affordable Pack of Flowers");
            valuePlan.setMonthlyPrice(new BigDecimal("300.00"));
            valuePlan.setFeatures("[\"Marigold (गेंदा)/Hibiscus (अड़हुल)/Butterfly Pea (अपराजिता)/Jasmine (चमेली)\", \"Doobh Grass (हरी दूब)\", \"Basil (तुलसी)\", \"Butterfly Pea (अपराजिता)/Red Marigold (लाल गेंदा)\", \"Hibiscus (अड़हुल)\", \"Belpatra (बेलपत्र) Every Monday\", \"Marigold Garland (गेंदा माला)\"]");
            valuePlan.setVolume("Approx 50 Grams");
            valuePlan.setActive(true);
            valuePlan.setPopular(false);
            valuePlan.setNotes("*Flower variety may change as per season and weather");
            valuePlan.setCreatedAt(LocalDateTime.now());
            valuePlan.setUpdatedAt(LocalDateTime.now());
            planRepository.save(valuePlan);
            System.out.println("✅ Created Value plan");

            // Basic Plan
            SubscriptionPlan basicPlan = new SubscriptionPlan();
            basicPlan.setPlanCode("basic");
            basicPlan.setName("Basic");
            basicPlan.setDescription("Exotic Pack of Mix Flowers");
            basicPlan.setMonthlyPrice(new BigDecimal("600.00"));
            basicPlan.setFeatures("[\"Marigold (गेंदा)\", \"Doobh Grass (हरी दूब)\", \"Basil (तुलसी)\", \"Butterfly Pea (अपराजिता)/Red Marigold (लाल गेंदा)\", \"Shevanti (गुलदाउदी)/Jasmine (चमेली)\", \"Hibiscus (अड़हुल)\", \"Belpatra (बेलपत्र) Every Monday\", \"Marigold Garland (गेंदा माला)\"]");
            basicPlan.setVolume("Approx 100 Grams");
            basicPlan.setActive(true);
            basicPlan.setPopular(true);
            basicPlan.setNotes("**Any 3-4 varieties of flowers will be provided, depending on the season and weather");
            basicPlan.setCreatedAt(LocalDateTime.now());
            basicPlan.setUpdatedAt(LocalDateTime.now());
            planRepository.save(basicPlan);
            System.out.println("✅ Created Basic plan");

            // Premium Plan
            SubscriptionPlan premiumPlan = new SubscriptionPlan();
            premiumPlan.setPlanCode("premium");
            premiumPlan.setName("Premium");
            premiumPlan.setDescription("Pack of Mix Flowers with Mala");
            premiumPlan.setMonthlyPrice(new BigDecimal("900.00"));
            premiumPlan.setFeatures("[\"Marigold (गेंदा)\", \"Doobh Grass (हरी दूब)\", \"Basil (तुलसी)\", \"Butterfly Pea (अपराजिता)/Red Marigold (लाल गेंदा)\", \"Shevanti (गुलदाउदी)/Jasmine (चमेली)\", \"Hibiscus (अड़हुल)\", \"Belpatra (बेलपत्र) Every Monday\", \"Marigold Garland (गेंदा माला) (Optional)\"]");
            premiumPlan.setVolume("Either 2 Packets of the Basic Pack or 1 Basic Pack with 1 Mala");
            premiumPlan.setActive(true);
            premiumPlan.setPopular(false);
            premiumPlan.setNotes("**Any 3-4 varieties of flowers will be provided, depending on the season and weather");
            premiumPlan.setCreatedAt(LocalDateTime.now());
            premiumPlan.setUpdatedAt(LocalDateTime.now());
            planRepository.save(premiumPlan);
            System.out.println("✅ Created Premium plan");
            
            System.out.println("🎉 Database initialization completed successfully!");
            
        } catch (Exception e) {
            System.err.println("❌ Error initializing database: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
