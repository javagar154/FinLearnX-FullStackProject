package com.finlearnx.controller;

import com.finlearnx.dto.ApiResponse;
import com.finlearnx.dto.SipRequest;
import com.finlearnx.entity.SipHistory;
import com.finlearnx.entity.User;
import com.finlearnx.service.SipService;
import com.finlearnx.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sip")
@RequiredArgsConstructor
public class SipController {

    private final SipService sipService;
    private final UserService userService;

    @PostMapping("/calculate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> calculate(@Valid @RequestBody SipRequest request) {
        Map<String, Object> result = sipService.calculate(request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse<SipHistory>> saveCalculation(@Valid @RequestBody SipRequest request) {
        User user = userService.getCurrentUser();
        SipHistory history = sipService.saveCalculation(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("SIP calculation saved", history));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<SipHistory>>> getHistory() {
        User user = userService.getCurrentUser();
        List<SipHistory> history = sipService.getHistory(user.getId());
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
