package com.floro.config;

import com.floro.model.User;
import com.floro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.default.email:admin@floro.local}")
    private String adminEmail;

    @Value("${admin.default.password:admin123}")
    private String adminPassword;

    @Value("${admin.default.name:Admin}")
    private String adminName;

    @Value("${admin.default.phone:9999999999}")
    private String adminPhone;

    @Override
    public void run(String... args) {
        userRepository.findByEmail(adminEmail).ifPresentOrElse(existing -> {
            if (existing.getRole() != User.UserRole.ADMIN) {
                existing.setRole(User.UserRole.ADMIN);
                userRepository.save(existing);
                log.info("Promoted existing user '{}' to ADMIN.", adminEmail);
            } else {
                log.info("Admin user '{}' already exists.", adminEmail);
            }
        }, () -> {
            User admin = new User();
            admin.setName(adminName);
            admin.setEmail(adminEmail);
            admin.setPhone(adminPhone);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(User.UserRole.ADMIN);
            admin.setActive(true);
            admin.setEmailVerified(true);
            admin.setAddress("Admin Address");
            admin.setCity("Admin City");
            admin.setState("Admin State");
            admin.setPincode("000000");
            userRepository.save(admin);
            log.info("Created default ADMIN user with email '{}' and phone '{}'.", adminEmail, adminPhone);
        });
    }
}
