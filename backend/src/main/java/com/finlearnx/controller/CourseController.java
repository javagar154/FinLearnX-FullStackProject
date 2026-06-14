package com.finlearnx.controller;

import com.finlearnx.dto.ApiResponse;
import com.finlearnx.entity.CourseProgress;
import com.finlearnx.service.CourseProgressService;
import com.finlearnx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseProgressService progressService;
    private final UserService userService;

    @GetMapping("/progress")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllProgress() {
        Long userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(ApiResponse.success(progressService.getProgressMap(userId)));
    }

    @PostMapping("/progress/{courseId}")
    public ResponseEntity<ApiResponse<CourseProgress>> saveProgress(
            @PathVariable String courseId,
            @RequestBody Map<String, Integer> body) {
        Long userId = userService.getCurrentUser().getId();
        int percent = body.getOrDefault("percent", 0);
        int pagesRead = body.getOrDefault("pagesRead", 0);
        CourseProgress progress = progressService.saveProgress(userId, courseId, percent, pagesRead);
        return ResponseEntity.ok(ApiResponse.success("Progress saved", progress));
    }

    @PostMapping("/quiz/{courseId}")
    public ResponseEntity<ApiResponse<CourseProgress>> saveQuizScore(
            @PathVariable String courseId,
            @RequestBody Map<String, Integer> body) {
        Long userId = userService.getCurrentUser().getId();
        int score = body.getOrDefault("score", 0);
        CourseProgress progress = progressService.saveQuizScore(userId, courseId, score);
        String msg = score >= 60 ? "Quiz passed! Badge earned!" : "Quiz submitted. Keep learning!";
        return ResponseEntity.ok(ApiResponse.success(msg, progress));
    }

    @GetMapping("/progress/list")
    public ResponseEntity<ApiResponse<List<CourseProgress>>> getProgressList() {
        Long userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(ApiResponse.success(progressService.getAllProgress(userId)));
    }
}
