package com.finlearnx.controller;

import com.finlearnx.dto.ApiResponse;
import com.finlearnx.entity.Notification;
import com.finlearnx.service.NotificationService;
import com.finlearnx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getAll() {
        Long userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(ApiResponse.success(notificationService.getAll(userId)));
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<Notification>>> getUnread() {
        Long userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUnread(userId)));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        Long userId = userService.getCurrentUser().getId();
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", count)));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllRead() {
        Long userId = userService.getCurrentUser().getId();
        notificationService.markAllRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable Long id) {
        Long userId = userService.getCurrentUser().getId();
        notificationService.markRead(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearAll() {
        Long userId = userService.getCurrentUser().getId();
        notificationService.clearAll(userId);
        return ResponseEntity.ok(ApiResponse.success("All notifications cleared", null));
    }
}
