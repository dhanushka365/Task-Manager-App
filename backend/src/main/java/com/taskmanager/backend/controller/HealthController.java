package com.taskmanager.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/health")
@Tag(name = "Health Check", description = "Application health check APIs")
public class HealthController {

    @GetMapping
    @Operation(summary = "Health check", description = "Check if the application is running")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "Task Manager API is running",
                "timestamp", java.time.Instant.now().toString()
        ));
    }
}
