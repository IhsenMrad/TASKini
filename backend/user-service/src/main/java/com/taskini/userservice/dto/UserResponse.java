package com.taskini.userservice.dto;

public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String role;
    private Boolean banned;

    public UserResponse(Long id, String fullName, String email, String phone, String location, String role) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.role = role;
      this.banned = false;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getLocation() { return location; }
    public String getRole() { return role; }

  public Boolean getBanned() {
    return banned;
  }

  public void setBanned(Boolean banned) {
    this.banned = banned;
  }

  public UserResponse(Long id, String fullName, String email, String phone, String location, String role, Boolean banned) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.location = location;
    this.role = role;
    this.banned = banned;
  }
}
