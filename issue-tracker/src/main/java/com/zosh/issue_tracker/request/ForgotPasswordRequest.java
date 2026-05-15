package com.zosh.issue_tracker.request;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email;
}
