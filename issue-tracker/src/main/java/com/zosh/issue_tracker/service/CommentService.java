package com.zosh.issue_tracker.service;

import com.zosh.issue_tracker.model.Comment;

import java.util.List;

public interface CommentService {
    Comment createComment(Long issueId, Long userId, String content) throws Exception;

    void deleteComment(Long commentId, Long userId) throws Exception;

    List<Comment> getCommentsByIssueId(Long issueId);
}
