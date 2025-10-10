package com.floro.repository;

import com.floro.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findByStatus(ContactMessage.MessageStatus status);
    List<ContactMessage> findByEmail(String email);
}


