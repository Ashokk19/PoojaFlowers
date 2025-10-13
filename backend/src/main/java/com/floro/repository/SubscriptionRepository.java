package com.floro.repository;

import com.floro.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    
    @Query("SELECT s FROM Subscription s JOIN FETCH s.plan WHERE s.user.id = :userId ORDER BY s.createdAt DESC")
    List<Subscription> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT s FROM Subscription s JOIN FETCH s.plan WHERE s.id = :id")
    Optional<Subscription> findByIdWithPlan(@Param("id") Long id);
    
    List<Subscription> findByStatus(Subscription.SubscriptionStatus status);
    List<Subscription> findByUserIdAndStatus(Long userId, Subscription.SubscriptionStatus status);
    List<Subscription> findByStatusAndEndDateBefore(Subscription.SubscriptionStatus status, java.time.LocalDate date);
    List<Subscription> findByStatusAndAutoRenewTrueAndEndDateBefore(Subscription.SubscriptionStatus status, java.time.LocalDate date);
    List<Subscription> findByStatusAndAutoRenewFalseAndEndDateBefore(Subscription.SubscriptionStatus status, java.time.LocalDate date);

    @Query("SELECT COUNT(s) > 0 FROM Subscription s WHERE s.user.id = :userId AND s.plan.id = :planId AND s.startDate = :startDate")
    boolean existsRenewal(@Param("userId") Long userId, @Param("planId") Long planId, @Param("startDate") java.time.LocalDate startDate);

    @Query("SELECT MAX(s.endDate) FROM Subscription s WHERE s.user.id = :userId AND s.status IN :statuses AND s.endDate >= :today")
    java.time.LocalDate findLatestEndDateForUserWithStatuses(@Param("userId") Long userId,
                                                            @Param("statuses") List<Subscription.SubscriptionStatus> statuses,
                                                            @Param("today") java.time.LocalDate today);

    @Query("SELECT s FROM Subscription s JOIN FETCH s.plan p JOIN FETCH s.user u ORDER BY s.createdAt DESC")
    List<Subscription> findAllWithUserAndPlan();

    // Find the earliest upcoming subscription for a user (startDate strictly after today)
    java.util.Optional<Subscription> findFirstByUser_IdAndStartDateAfterOrderByStartDateAsc(Long userId, java.time.LocalDate today);
}
