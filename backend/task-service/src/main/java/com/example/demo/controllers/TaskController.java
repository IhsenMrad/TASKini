package com.example.demo.controllers;

import com.example.demo.entities.TaskEntity;
import com.example.demo.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // POST /tasks - Create new task
    @PostMapping
    public TaskEntity createTask(@RequestBody TaskEntity task) {
      task.setCreatedAt(LocalDateTime.now());
      // Ensure flagged field has a value if not provided in request
      if (task.getFlagged() == null) {
        task.setFlagged(false);
      }
      return taskRepository.save(task);
    }
    // GET /tasks - Get all tasks
    @GetMapping
    public List<TaskEntity> getAllTasks() {
        return taskRepository.findAll();
    }

    // GET /tasks/{id} - Get task by ID
    @GetMapping("/{id}")
    public Optional<TaskEntity> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id);
    }

    // GET /tasks/user/{userId} - Get tasks by creator
    @GetMapping("/user/{userId}")
    public List<TaskEntity> getTasksByUser(@PathVariable Long userId) {
        return taskRepository.findByCreatorId(userId);
    }

    // PUT /tasks/{id} - Update task
    @PutMapping("/{id}")
    public TaskEntity updateTask(@PathVariable Long id, @RequestBody TaskEntity taskDetails) {
        TaskEntity task = taskRepository.findById(id).orElse(null);

        if (task == null) {
            // Retourner null ou lever une exception
            return null;
        }

        // Mettre à jour uniquement les champs nécessaires
        if (taskDetails.getTitle() != null) task.setTitle(taskDetails.getTitle());
        if (taskDetails.getDescription() != null) task.setDescription(taskDetails.getDescription());
        if (taskDetails.getCategory() != null) task.setCategory(taskDetails.getCategory());
        if (taskDetails.getBudget() != null) task.setBudget(taskDetails.getBudget());
        if (taskDetails.getLocation() != null) task.setLocation(taskDetails.getLocation());
        if (taskDetails.getDeadline() != null) task.setDeadline(taskDetails.getDeadline());
        if (taskDetails.getStatus() != null) task.setStatus(taskDetails.getStatus());

        return taskRepository.save(task);
    }
}
