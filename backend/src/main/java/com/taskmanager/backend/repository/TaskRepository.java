package com.taskmanager.backend.repository;

import com.taskmanager.backend.entity.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserId(String userId);
    List<Task> findByUserIdAndStatus(String userId, String status);
    List<Task> findByUserIdOrderByCreatedAtDesc(String userId);
}

