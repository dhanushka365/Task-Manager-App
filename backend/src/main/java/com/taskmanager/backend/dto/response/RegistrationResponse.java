package com.taskmanager.backend.dto.response;

public class RegistrationResponse {
    private String message;
    private String username;
    private boolean success;
    
    public RegistrationResponse() {
        // Default constructor for Jackson
    }
    
    public RegistrationResponse(String message, String username, boolean success) {
        this.message = message;
        this.username = username;
        this.success = success;
    }
    
    // Getters
    public String getMessage() { 
        return message; 
    }
    
    public String getUsername() { 
        return username; 
    }
    
    public boolean isSuccess() { 
        return success; 
    }
    
    // Setters
    public void setMessage(String message) { 
        this.message = message; 
    }
    
    public void setUsername(String username) { 
        this.username = username; 
    }
    
    public void setSuccess(boolean success) { 
        this.success = success; 
    }
}
