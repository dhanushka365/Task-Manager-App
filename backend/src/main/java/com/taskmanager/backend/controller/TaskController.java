package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.request.TaskDto;
import com.taskmanager.backend.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@Tag(name = "Tasks", description = "Task management APIs")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    @Operation(summary = "Get all tasks", description = "Get all tasks for authenticated user")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        List<TaskDto> tasks = taskService.getAllTasksByUser(username);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID", description = "Get a specific task by ID")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            TaskDto task = taskService.getTaskById(id, username);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @Operation(summary = "Create task", description = "Create a new task")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<TaskDto> createTask(@Valid @RequestBody TaskDto taskDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        TaskDto createdTask = taskService.createTask(taskDto, username);
        return ResponseEntity.ok(createdTask);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task", description = "Update an existing task")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<TaskDto> updateTask(@PathVariable String id, @Valid @RequestBody TaskDto taskDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            TaskDto updatedTask = taskService.updateTask(id, taskDto, username);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task", description = "Delete a task")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            taskService.deleteTask(id, username);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get tasks by status", description = "Get tasks filtered by status")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<List<TaskDto>> getTasksByStatus(@PathVariable String status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        List<TaskDto> tasks = taskService.getTasksByStatus(status, username);
        return ResponseEntity.ok(tasks);
    }
}

