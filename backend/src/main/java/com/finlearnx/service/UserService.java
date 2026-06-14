package com.finlearnx.service;

import com.finlearnx.entity.User;
import com.finlearnx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateWallet(Long userId, Double newBalance) {
        User user = getUserById(userId);
        user.setWalletBalance(newBalance);
        return userRepository.save(user);
    }

    public User updateProfile(Long userId, String name) {
        User user = getUserById(userId);
        user.setName(name);
        return userRepository.save(user);
    }
}
