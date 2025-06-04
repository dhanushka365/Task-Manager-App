package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.request.TaskDto;
import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    public List<TaskDto> getAllTasksByUser(String username) {
        User user = userService.findByUsername(username);
        List<Task> tasks = taskRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return tasks.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public TaskDto getTaskById(String id, String username) {
        User user = userService.findByUsername(username);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUserId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return convertToDto(task);
    }

    public TaskDto createTask(TaskDto taskDto, String username) {
        User user = userService.findByUsername(username);

        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskDto.getStatus() != null ? taskDto.getStatus() : "TO_DO");
        task.setUserId(user.getId());

        Task savedTask = taskRepository.save(task);
        return convertToDto(savedTask);
    }

    public TaskDto updateTask(String id, TaskDto taskDto, String username) {
        User user = userService.findByUsername(username);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUserId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskDto.getStatus());
        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);
        return convertToDto(updatedTask);
    }

    public void deleteTask(String id, String username) {
        User user = userService.findByUsername(username);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUserId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        taskRepository.delete(task);
    }

    public List<TaskDto> getTasksByStatus(String status, String username) {
        User user = userService.findByUsername(username);
        List<Task> tasks = taskRepository.findByUserIdAndStatus(user.getId(), status);
        return tasks.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private TaskDto convertToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }
}