package com.finlearnx.controller;

import com.finlearnx.dto.ApiResponse;
import com.finlearnx.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> search(
            @RequestParam(required = false, defaultValue = "") String q) {
        Map<String, Object> results = searchService.search(q);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    // Public endpoint — no auth required for search suggestions
    @GetMapping("/public")
    public ResponseEntity<ApiResponse<Map<String, Object>>> publicSearch(
            @RequestParam(required = false, defaultValue = "") String q) {
        Map<String, Object> results = searchService.search(q);
        return ResponseEntity.ok(ApiResponse.success(results));
    }
}
