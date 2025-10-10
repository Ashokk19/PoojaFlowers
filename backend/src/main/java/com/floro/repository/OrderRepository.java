package com.floro.repository;

import com.floro.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByUserId(Long userId);
    List<Order> findBySubscriptionId(Long subscriptionId);
    List<Order> findByDeliveryDate(LocalDate deliveryDate);
    List<Order> findByStatus(Order.OrderStatus status);
}


