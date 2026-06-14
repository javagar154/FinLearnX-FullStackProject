package com.finlearnx.controller;

import com.finlearnx.dto.ApiResponse;
import com.finlearnx.entity.PremiumUnlock;
import com.finlearnx.service.PremiumService;
import com.finlearnx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/premium")
@RequiredArgsConstructor
public class PremiumController {

    private final PremiumService premiumService;
    private final UserService userService;

    @PostMapping("/unlock/{courseId}")
    public ResponseEntity<ApiResponse<PremiumUnlock>> unlockCourse(@PathVariable String courseId) {
        Long userId = userService.getCurrentUser().getId();
        PremiumUnlock unlock = premiumService.unlockCourse(userId, courseId);
        return ResponseEntity.ok(ApiResponse.success("Course unlocked successfully", unlock));
    }

    @GetMapping("/unlocked")
    public ResponseEntity<ApiResponse<List<String>>> getUnlockedCourses() {
        Long userId = userService.getCurrentUser().getId();
        List<String> courseIds = premiumService.getUnlockedCourseIds(userId);
        return ResponseEntity.ok(ApiResponse.success(courseIds));
    }

    @GetMapping("/check/{courseId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkAccess(@PathVariable String courseId) {
        Long userId = userService.getCurrentUser().getId();
        boolean unlocked = premiumService.isCourseUnlocked(userId, courseId);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "courseId", courseId,
                "unlocked", unlocked,
                "message", unlocked ? "Access granted" : "Course not unlocked. Purchase for $100."
        )));
    }
}
