package com.floro.service;

import com.floro.dto.ContactRequest;
import com.floro.model.ContactMessage;
import com.floro.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {
    
    private final ContactMessageRepository contactMessageRepository;
    
    @Transactional
    public ContactMessage createContactMessage(ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setPhone(request.getPhone());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());
        message.setStatus(ContactMessage.MessageStatus.NEW);
        
        return contactMessageRepository.save(message);
    }
    
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }
    
    public List<ContactMessage> getMessagesByStatus(ContactMessage.MessageStatus status) {
        return contactMessageRepository.findByStatus(status);
    }
}


