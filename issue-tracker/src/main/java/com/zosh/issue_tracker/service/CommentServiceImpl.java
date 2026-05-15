package com.zosh.issue_tracker.service;

import com.zosh.issue_tracker.model.Comment;
import com.zosh.issue_tracker.model.Issue;
import com.zosh.issue_tracker.model.User;
import com.zosh.issue_tracker.repository.CommentRepository;
import com.zosh.issue_tracker.repository.IssueRepository;
import com.zosh.issue_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Comment createComment(Long issueId, Long userId, String content) throws Exception {
        Optional<Issue> issueOptional = issueRepository.findById(issueId);
        Optional<User> userOptional = userRepository.findById(userId);

        if (issueOptional.isEmpty()) {
            throw new Exception("issue not found with id " + issueId);
        }
        if (userOptional.isEmpty()) {
            throw new Exception("user not found with id " + userId);
        }

        Comment comment = new Comment();
        comment.setIssue(issueOptional.get());
        comment.setUser(userOptional.get());
        comment.setContent(content);
        comment.setCreatedDateTime(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(Long commentId, Long userId) throws Exception {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isEmpty()) {
            throw new Exception("comment not found with id " + commentId);
        }

        Comment comment = commentOptional.get();
        if (!comment.getUser().getId().equals(userId)) {
            throw new Exception("user doesn't have permission to delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Override
    public List<Comment> getCommentsByIssueId(Long issueId) {
        return commentRepository.findByIssueId(issueId);
    }
}
