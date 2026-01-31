package com.taskini.userservice.controller;

import com.taskini.userservice.dto.LoginRequest;
import com.taskini.userservice.dto.RegisterRequest;
import com.taskini.userservice.dto.UserResponse;
import com.taskini.userservice.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest body) {
        return authService.register(body);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest body) {
        return authService.login(body);
    }
}
