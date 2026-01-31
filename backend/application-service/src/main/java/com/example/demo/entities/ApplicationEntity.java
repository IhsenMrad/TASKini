package com.example.demo.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class ApplicationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long taskId;
    private Long applicantId;
    private String message;
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED
    private LocalDateTime createdAt;

    // Constructeurs
    public ApplicationEntity() {
        this.createdAt = LocalDateTime.now();
    }

    public ApplicationEntity(Long taskId, Long applicantId, String message) {
        this();
        this.taskId = taskId;
        this.applicantId = applicantId;
        this.message = message;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public Long getApplicantId() { return applicantId; }
    public void setApplicantId(Long applicantId) { this.applicantId = applicantId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}