package com.taskini.userservice.service;

import com.taskini.userservice.dto.UserResponse;
import com.taskini.userservice.entity.UserEntity;
import com.taskini.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public UserResponse getUserById(Long id) {
    UserEntity user = userRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("User not found"));

    return new UserResponse(
      user.getId(),
      user.getFullName(),
      user.getEmail(),
      user.getPhone(),
      user.getLocation(),
      user.getRole(),
      user.getBanned() // Include banned status
    );
  }
}
