package com.taskini.userservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class UserEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(length = 150)
  private String fullName;

  @Column(unique = true, length = 150, nullable = false)
  private String email;

  private String password;
  private String phone;
  private String location;
  private String role;

  @Column(nullable = false)
  private Boolean banned = false;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  public UserEntity() {
    this.banned = false;
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  public UserEntity(String fullName, String email, String password, String phone, String location, String role) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.location = location;
    this.role = role;
    this.banned = false;
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  // GETTERS & SETTERS
  public Long getId() { return id; }

  public String getFullName() { return fullName; }
  public void setFullName(String fullName) { this.fullName = fullName; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public String getLocation() { return location; }
  public void setLocation(String location) { this.location = location; }

  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }

  public Boolean getBanned() { return banned; }
  public void setBanned(Boolean banned) { this.banned = banned; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

  // Lifecycle methods
  @PrePersist
  protected void onCreate() {
    if (createdAt == null) {
      createdAt = LocalDateTime.now();
    }
    if (updatedAt == null) {
      updatedAt = LocalDateTime.now();
    }
    if (banned == null) {
      banned = false;
    }
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
