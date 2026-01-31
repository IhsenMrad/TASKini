package com.example.demo.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class TaskEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String description;
  private String category;
  private Double budget;
  private String location;
  private LocalDateTime deadline;
  private String status; // OPEN, IN_PROGRESS, COMPLETED
  private Long creatorId;
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private Boolean flagged = false; // Add this field
  public TaskEntity() {
  }
  // Constructors
  public TaskEntity(Long id, String title, String description, String category, Double budget,
                    String location, LocalDateTime deadline, String status, Long creatorId,
                    LocalDateTime createdAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.budget = budget;
    this.location = location;
    this.deadline = deadline;
    this.status = status;
    this.creatorId = creatorId;
    this.createdAt = createdAt;
    this.flagged = false; // Initialize with default value
  }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

  public Boolean getFlagged() {
    return flagged;
  }

  public void setFlagged(Boolean flagged) {
    this.flagged = flagged;
  }
    // Méthode toString() optionnelle mais utile pour le débogage
    @Override
    public String toString() {
      return "TaskEntity{" +
        "id=" + id +
        ", title='" + title + '\'' +
        ", description='" + description + '\'' +
        ", category='" + category + '\'' +
        ", budget=" + budget +
        ", location='" + location + '\'' +
        ", deadline=" + deadline +
        ", status='" + status + '\'' +
        ", creatorId=" + creatorId +
        ", createdAt=" + createdAt +
        ", flagged=" + flagged +
        '}';
    }
}
