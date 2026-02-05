package com.zosh.issue_tracker.response;

import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String message;
}
