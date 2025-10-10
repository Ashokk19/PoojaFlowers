package com.floro.repository;

import com.floro.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserId(Long userId);
    List<Subscription> findByStatus(Subscription.SubscriptionStatus status);
    List<Subscription> findByUserIdAndStatus(Long userId, Subscription.SubscriptionStatus status);
}


