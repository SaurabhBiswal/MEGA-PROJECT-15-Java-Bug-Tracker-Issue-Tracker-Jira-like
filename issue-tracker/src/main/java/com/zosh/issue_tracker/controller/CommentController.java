package com.zosh.issue_tracker.controller;

import com.zosh.issue_tracker.model.Comment;
import com.zosh.issue_tracker.model.User;
import com.zosh.issue_tracker.response.MessageResponse;
import com.zosh.issue_tracker.service.CommentService;
import com.zosh.issue_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Comment> createComment(
            @RequestBody Comment comment) throws Exception {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        User user = userService.findUserByEmail(email);
        Comment createdComment = commentService.createComment(
                comment.getIssue().getId(),
                user.getId(),
                comment.getContent());
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<MessageResponse> deleteComment(
            @PathVariable Long commentId) throws Exception {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        User user = userService.findUserByEmail(email);
        commentService.deleteComment(commentId, user.getId());
        MessageResponse res = new MessageResponse();
        res.setMessage("comment deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/{issueId}")
    public ResponseEntity<List<Comment>> getCommentsByIssueId(@PathVariable Long issueId) {
        List<Comment> comments = commentService.getCommentsByIssueId(issueId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
}
