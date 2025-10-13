package com.floro.scheduler;

import com.floro.model.Subscription;
import com.floro.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AutoRenewScheduler {

    private final SubscriptionRepository subscriptionRepository;

    // Run daily at 02:15 AM server time
    @Scheduled(cron = "0 15 2 * * *")
    @Transactional
    public void processRenewals() {
        LocalDate today = LocalDate.now();
        List<Subscription> toRenew = subscriptionRepository
                .findByStatusAndAutoRenewTrueAndEndDateBefore(Subscription.SubscriptionStatus.ACTIVE, today);

        for (Subscription sub : toRenew) {
            LocalDate newStart = sub.getEndDate().plusDays(1);
            // Avoid duplicates if this job runs multiple times
            if (subscriptionRepository.existsRenewal(sub.getUser().getId(), sub.getPlan().getId(), newStart)) {
                continue;
            }
            Subscription renewed = new Subscription();
            renewed.setUser(sub.getUser());
            renewed.setPlan(sub.getPlan());
            renewed.setStartDate(newStart);
            renewed.setEndDate(newStart.plusMonths(1));
            renewed.setAmount(sub.getPlan().getMonthlyPrice());
            renewed.setDeliveryAddress(sub.getDeliveryAddress());
            renewed.setDeliveryInstructions(sub.getDeliveryInstructions());
            renewed.setAutoRenew(true);
            renewed.setStatus(Subscription.SubscriptionStatus.ACTIVE);
            subscriptionRepository.save(renewed);
        }
    }

    // Run daily at 02:25 AM to expire finished non-renewing or cancelled subs
    @Scheduled(cron = "0 25 2 * * *")
    @Transactional
    public void processExpirations() {
        LocalDate today = LocalDate.now();
        // Active but auto-renew OFF and past end date -> EXPIRED
        List<Subscription> toExpire = subscriptionRepository
                .findByStatusAndAutoRenewFalseAndEndDateBefore(Subscription.SubscriptionStatus.ACTIVE, today);
        for (Subscription sub : toExpire) {
            sub.setStatus(Subscription.SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(sub);
        }
        // Cancelled and past end date -> EXPIRED
        List<Subscription> cancelled = subscriptionRepository
                .findByStatusAndEndDateBefore(Subscription.SubscriptionStatus.CANCELLED, today);
        for (Subscription sub : cancelled) {
            sub.setStatus(Subscription.SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(sub);
        }
    }
}
