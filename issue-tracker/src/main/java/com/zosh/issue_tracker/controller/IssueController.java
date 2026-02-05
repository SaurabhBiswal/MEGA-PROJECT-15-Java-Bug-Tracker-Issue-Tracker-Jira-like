package com.zosh.issue_tracker.controller;

import com.zosh.issue_tracker.model.Issue;
import com.zosh.issue_tracker.model.User;
import com.zosh.issue_tracker.request.IssueRequest;
import com.zosh.issue_tracker.response.MessageResponse;
import com.zosh.issue_tracker.service.IssueService;
import com.zosh.issue_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserService userService;

    @GetMapping("/{issueId}")
    public ResponseEntity<Issue> getIssueById(@PathVariable Long issueId) throws Exception {
        return ResponseEntity.ok(issueService.getIssueById(issueId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Issue>> getIssueByProjectId(@PathVariable Long projectId) throws Exception {
        return ResponseEntity.ok(issueService.getIssueByProjectId(projectId));
    }

    @PostMapping
    public ResponseEntity<Issue> createIssue(@RequestBody IssueRequest issue,
            @RequestHeader("Authorization") String token) throws Exception {
        User user = userService.findUserByJwt(token);
        Issue createdIssue = issueService.createIssue(issue, user);
        return ResponseEntity.ok(createdIssue);
    }

    @DeleteMapping("/{issueId}")
    public ResponseEntity<MessageResponse> deleteIssue(@PathVariable Long issueId,
            @RequestHeader("Authorization") String token) throws Exception {
        User user = userService.findUserByJwt(token);
        issueService.deleteIssue(issueId, user.getId());
        MessageResponse res = new MessageResponse("Issue deleted");
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{issueId}/assignee/{userId}")
    public ResponseEntity<Issue> addUserToIssue(@PathVariable Long issueId, @PathVariable Long userId)
            throws Exception {
        Issue issue = issueService.addUserToIssue(issueId, userId);
        return ResponseEntity.ok(issue);
    }

    @PutMapping("/{issueId}/status/{status}")
    public ResponseEntity<Issue> updateStatus(@PathVariable Long issueId, @PathVariable String status)
            throws Exception {
        Issue issue = issueService.updateStatus(issueId, status);
        return ResponseEntity.ok(issue);
    }
}
