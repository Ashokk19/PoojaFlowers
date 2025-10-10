package com.floro.controller;

import com.floro.dto.ContactRequest;
import com.floro.model.ContactMessage;
import com.floro.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
public class ContactController {
    
    private final ContactService contactService;
    
    @PostMapping
    public ResponseEntity<ContactMessage> submitContactForm(@Valid @RequestBody ContactRequest request) {
        return ResponseEntity.ok(contactService.createContactMessage(request));
    }
    
    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ContactMessage>> getMessagesByStatus(
            @PathVariable ContactMessage.MessageStatus status) {
        return ResponseEntity.ok(contactService.getMessagesByStatus(status));
    }
}


