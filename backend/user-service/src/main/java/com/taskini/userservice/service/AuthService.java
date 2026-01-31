package com.taskini.userservice.service;

import com.taskini.userservice.dto.LoginRequest;
import com.taskini.userservice.dto.RegisterRequest;
import com.taskini.userservice.dto.UserResponse;
import com.taskini.userservice.entity.UserEntity;
import com.taskini.userservice.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public UserResponse register(RegisterRequest req) {

    if (userRepository.findByEmail(req.getEmail()).isPresent()) {
      throw new RuntimeException("Email already exists");
    }

    UserEntity user = new UserEntity(
      req.getFullName(),
      req.getEmail(),
      passwordEncoder.encode(req.getPassword()),
      req.getPhone(),
      req.getLocation(),
      "USER"
    );

    // Ensure banned is explicitly set to false
    user.setBanned(false);

    UserEntity saved = userRepository.save(user);

    return new UserResponse(
      saved.getId(),
      saved.getFullName(),
      saved.getEmail(),
      saved.getPhone(),
      saved.getLocation(),
      saved.getRole()
    );
  }

  public UserResponse login(LoginRequest req) {

    UserEntity user = userRepository.findByEmail(req.getEmail())
      .orElseThrow(() -> new RuntimeException("Email not found"));

    if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
      throw new RuntimeException("Incorrect password");
    }

    // Check if user is banned
    if (user.getBanned() != null && user.getBanned()) {
      throw new RuntimeException("Account is banned. Please contact support.");
    }

    return new UserResponse(
      user.getId(),
      user.getFullName(),
      user.getEmail(),
      user.getPhone(),
      user.getLocation(),
      user.getRole()
    );
  }
}
