package com.zosh.issue_tracker.config;

import com.zosh.issue_tracker.response.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<MessageResponse> handleBadCredentialsException(
            org.springframework.security.authentication.BadCredentialsException ex) {
        return new ResponseEntity<MessageResponse>(new MessageResponse(ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponse> handleGlobalException(Exception ex, WebRequest request) {
        ex.printStackTrace(); // Log to server terminal
        String message = "[" + ex.getClass().getSimpleName() + "] " + ex.getMessage();
        return new ResponseEntity<MessageResponse>(new MessageResponse(message), HttpStatus.BAD_REQUEST);
    }
}
