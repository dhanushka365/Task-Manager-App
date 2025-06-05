package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.request.JwtRequest;
import com.taskmanager.backend.dto.request.UserDto;
import com.taskmanager.backend.dto.response.JwtResponse;
import com.taskmanager.backend.dto.response.RegistrationResponse;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.service.JwtUserDetailsService;
import com.taskmanager.backend.service.UserService;
import com.taskmanager.backend.util.JwtTokenUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:3000", "http://localhost:3001", "http://localhost:4200"})
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    @GetMapping("/test")
    @Operation(summary = "Test endpoint", description = "Test if the auth controller is working")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth controller is working!");
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticate user and return JWT token")
    public ResponseEntity<?> login(@Valid @RequestBody JwtRequest authenticationRequest) throws Exception {
        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());

        final UserDetails userDetails = userDetailsService
                .loadUserByUsername(authenticationRequest.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(token, userDetails.getUsername()));
    }

    @PostMapping("/register")
    @Operation(summary = "Register user", description = "Register a new user")
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody UserDto userDto) {
        try {
            System.out.println("Registration request received for username: " + userDto.getUsername());
            User user = userService.registerUser(userDto);
            System.out.println("User registered successfully: " + user.getUsername());
            
            // Create response object
            RegistrationResponse response = new RegistrationResponse(
                "User registered successfully", 
                user.getUsername(), 
                true
            );
            
            System.out.println("Sending response: " + response.getMessage());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            
            // For errors, we'll return a different response
            RegistrationResponse errorResponse = new RegistrationResponse(
                e.getMessage(), 
                userDto.getUsername(), 
                false
            );
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            System.err.println("Unexpected error during registration: " + e.getMessage());
            e.printStackTrace();
            
            RegistrationResponse errorResponse = new RegistrationResponse(
                "Internal server error", 
                userDto.getUsername(), 
                false
            );
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}

