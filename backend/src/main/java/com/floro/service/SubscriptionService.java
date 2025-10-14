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
import java.util.Arrays;
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
        
        // Handle upcoming subscription logic relative to the requested start date
        LocalDate today = LocalDate.now();
        java.util.Optional<Subscription> nextUpcomingOpt = subscriptionRepository
            .findFirstByUser_IdAndStartDateAfterOrderByStartDateAsc(userId, today);
        if (nextUpcomingOpt.isPresent()) {
            Subscription nextUpcoming = nextUpcomingOpt.get();
            // If the requested start date falls within the upcoming subscription window, prompt change-plan flow
            if (!request.getStartDate().isAfter(nextUpcoming.getEndDate()) &&
                !request.getStartDate().isBefore(nextUpcoming.getStartDate())) {
                throw new RuntimeException("Upcoming subscription already exists for next month. Do you want to change its plan to the selected plan?");
            }
            // If requested date is after the upcoming end date, create a new subscription
            // and disable auto-renew on older ones (subscriptions starting before the new one)
            if (request.getStartDate().isAfter(nextUpcoming.getEndDate())) {
                List<Subscription> existing = subscriptionRepository.findByUserId(userId);
                for (Subscription s : existing) {
                    if (Boolean.TRUE.equals(s.getAutoRenew()) && s.getStartDate() != null && s.getStartDate().isBefore(request.getStartDate())) {
                        s.setAutoRenew(false);
                        subscriptionRepository.save(s);
                    }
                }
            }
        }

        // Validate start date: must be AFTER any ongoing coverage (ACTIVE or CANCELLED that hasn't ended yet)
        LocalDate latestEnd = subscriptionRepository.findLatestEndDateForUserWithStatuses(
            userId,
            Arrays.asList(Subscription.SubscriptionStatus.ACTIVE, Subscription.SubscriptionStatus.CANCELLED),
            today
        );
        if (latestEnd != null && !request.getStartDate().isAfter(latestEnd)) {
            throw new RuntimeException("You have already subscription active in this date");
        }

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStartDate(request.getStartDate());
        subscription.setEndDate(request.getStartDate().plusMonths(1));
        java.math.BigDecimal price = plan.getMonthlyPrice();
        boolean useBonus = Boolean.TRUE.equals(request.getUseReferralBonus());
        if (useBonus && user.getReferralBonusAvailable() != null && user.getReferralBonusAvailable() > 0) {
            java.math.BigDecimal discount = price.multiply(new java.math.BigDecimal("0.10"));
            price = price.subtract(discount).setScale(2, java.math.RoundingMode.HALF_UP);
            // consume one bonus
            user.setReferralBonusAvailable(user.getReferralBonusAvailable() - 1);
            user.setReferralBonusUsed((user.getReferralBonusUsed() == null ? 0 : user.getReferralBonusUsed()) + 1);
            userRepository.save(user);
        }
        subscription.setAmount(price);
        subscription.setDeliveryAddress(request.getDeliveryAddress());
        subscription.setDeliveryInstructions(request.getDeliveryInstructions());
        subscription.setAutoRenew(request.getAutoRenew());
        subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        
        // First-time purchase: if this user signed up with a referrer code, credit referrer's available bonus (up to max)
        long existingCount = subscriptionRepository.countByUser_Id(userId);
        if (existingCount == 0 && user.getReferrerCodeUsed() != null && !user.getReferrerCodeUsed().isBlank()) {
            userRepository.findByReferralCode(user.getReferrerCodeUsed()).ifPresent(referrer -> {
                Integer max = referrer.getReferralBonusMax() != null ? referrer.getReferralBonusMax() : 3;
                Integer available = referrer.getReferralBonusAvailable() != null ? referrer.getReferralBonusAvailable() : 0;
                if (available < max) {
                    referrer.setReferralBonusAvailable(available + 1);
                    userRepository.save(referrer);
                }
            });
        }

        // Generate referral code on first-ever subscription for this user
        if (user.getReferralCode() == null || user.getReferralCode().isBlank()) {
            String code = generateUniqueReferralCode();
            user.setReferralCode(code);
            userRepository.save(user);
        }

        Subscription saved = subscriptionRepository.save(subscription);
        refreshCurrentFlags(userId);
        return saved;
    }
    
    public List<Subscription> getUserSubscriptions(Long userId) {
        return subscriptionRepository.findByUserId(userId);
    }
    
    public Subscription getSubscriptionById(Long id) {
        return subscriptionRepository.findByIdWithPlan(id)
            .orElseThrow(() -> new RuntimeException("Subscription not found"));
    }
    
    @Transactional
    public Subscription updateSubscriptionStatus(Long id, Subscription.SubscriptionStatus status) {
        System.out.println("Updating subscription status - ID: " + id + ", Status: " + status);
        Subscription subscription = subscriptionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Subscription not found"));
        System.out.println("Found subscription: " + subscription.getId() + ", Current status: " + subscription.getStatus());
        subscription.setStatus(status);
        Subscription updated = subscriptionRepository.save(subscription);
        refreshCurrentFlags(subscription.getUser().getId());
        System.out.println("Updated subscription status to: " + updated.getStatus());
        return updated;
    }
    
    @Transactional
    public void cancelSubscription(Long id) {
        Subscription subscription = getSubscriptionById(id);
        subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
        subscription.setAutoRenew(false);
        subscriptionRepository.save(subscription);
        refreshCurrentFlags(subscription.getUser().getId());
    }

    @Transactional
    public Subscription changeNextUpcomingPlan(Long userId, Long newPlanId) {
        LocalDate today = LocalDate.now();
        Subscription upcoming = subscriptionRepository
            .findFirstByUser_IdAndStartDateAfterOrderByStartDateAsc(userId, today)
            .orElseThrow(() -> new RuntimeException("No upcoming subscription found to change"));

        SubscriptionPlan newPlan = planRepository.findById(newPlanId)
            .orElseThrow(() -> new RuntimeException("Plan not found"));

        upcoming.setPlan(newPlan);
        upcoming.setAmount(newPlan.getMonthlyPrice());
        // keep startDate/endDate the same; status remains as-is (ACTIVE for now)
        Subscription saved = subscriptionRepository.save(upcoming);
        refreshCurrentFlags(userId);
        return saved;
    }

    @Transactional
    public void hardDeleteSubscription(Long id) {
        Subscription s = getSubscriptionById(id);
        LocalDate today = LocalDate.now();
        boolean isCurrentActive = s.getStatus() == Subscription.SubscriptionStatus.ACTIVE
                && (s.getStartDate() == null || !today.isBefore(s.getStartDate()))
                && (s.getEndDate() == null || !today.isAfter(s.getEndDate()));
        if (isCurrentActive) {
            throw new RuntimeException("Cannot delete current active subscription");
        }
        if (s.getStartDate() != null && !s.getStartDate().isBefore(today)) {
            throw new RuntimeException("Cannot delete a subscription that starts today or in the future");
        }
        subscriptionRepository.delete(s);
        refreshCurrentFlags(s.getUser().getId());
    }

    private void refreshCurrentFlags(Long userId) {
        LocalDate today = LocalDate.now();
        List<Subscription> list = subscriptionRepository.findByUserId(userId);
        for (Subscription s : list) {
            boolean isCurrent = s.getStatus() == Subscription.SubscriptionStatus.ACTIVE
                && (s.getStartDate() == null || !today.isBefore(s.getStartDate()))
                && (s.getEndDate() == null || !today.isAfter(s.getEndDate()));
            if (!Boolean.valueOf(isCurrent).equals(s.getCurrent())) {
                s.setCurrent(isCurrent);
                subscriptionRepository.save(s);
            }
        }
    }

    private String generateUniqueReferralCode() {
        String code;
        do {
            code = java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        } while (userRepository.findByReferralCode(code).isPresent());
        return code;
    }
}


