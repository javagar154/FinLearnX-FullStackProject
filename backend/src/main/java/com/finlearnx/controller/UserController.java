package com.finlearnx.controller;

import com.finlearnx.dto.ApiResponse;
import com.finlearnx.entity.User;
import com.finlearnx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile() {
        User user = userService.getCurrentUser();
        Map<String, Object> profile = Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "walletBalance", user.getWalletBalance(),
                "createdAt", user.getCreatedAt()
        );
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@RequestBody Map<String, String> body) {
        User user = userService.getCurrentUser();
        String name = body.get("name");
        if (name != null && !name.isBlank()) {
            user = userService.updateProfile(user.getId(), name);
        }
        return ResponseEntity.ok(ApiResponse.success("Profile updated", user));
    }
}
