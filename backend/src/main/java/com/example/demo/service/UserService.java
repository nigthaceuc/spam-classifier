package com.example.demo.service;

import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public UserService(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }
    public Optional<User> findEnabledByEmail(String email) {
        return userRepository.findByEmailAndEnabledTrue(email);
    }
    public User register(String firstName, String lastName, String email, String rawPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
        String hashed = encoder.encode(rawPassword);
        User u = new User(firstName, lastName, email, hashed);
        return userRepository.save(u);
    }

    public User getByEmailOrThrow(String email) {
        return userRepository.findByEmailAndEnabledTrue(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found or disabled"));
    }
}
