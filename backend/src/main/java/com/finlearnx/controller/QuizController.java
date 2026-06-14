package com.finlearnx.controller;

import com.finlearnx.dto.ApiResponse;
import com.finlearnx.entity.QuizResult;
import com.finlearnx.entity.User;
import com.finlearnx.service.QuizService;
import com.finlearnx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final UserService userService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<QuizResult>> submitQuiz(@RequestBody Map<String, Object> body) {
        User user = userService.getCurrentUser();
        String courseId = (String) body.get("courseId");
        int score = Integer.parseInt(body.get("score").toString());
        int totalQuestions = Integer.parseInt(body.get("totalQuestions").toString());

        QuizResult result = quizService.saveResult(user.getId(), courseId, score, totalQuestions);
        String msg = result.isPassed() ? "Congratulations! You passed the quiz!" : "Quiz submitted. Keep learning!";
        return ResponseEntity.ok(ApiResponse.success(msg, result));
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<List<QuizResult>>> getResults() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(quizService.getUserResults(user.getId())));
    }

    @GetMapping("/results/{courseId}")
    public ResponseEntity<ApiResponse<QuizResult>> getBestResult(@PathVariable String courseId) {
        User user = userService.getCurrentUser();
        Optional<QuizResult> result = quizService.getBestResult(user.getId(), courseId);
        return result.map(r -> ResponseEntity.ok(ApiResponse.success(r)))
                .orElse(ResponseEntity.ok(ApiResponse.error("No quiz result found for this course")));
    }
}
