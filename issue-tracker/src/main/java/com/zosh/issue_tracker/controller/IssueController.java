package com.zosh.issue_tracker.controller;

import com.zosh.issue_tracker.model.Issue;
import com.zosh.issue_tracker.model.User;
import com.zosh.issue_tracker.request.IssueRequest;
import com.zosh.issue_tracker.response.MessageResponse;
import com.zosh.issue_tracker.service.FileStorageService;
import com.zosh.issue_tracker.service.IssueService;
import com.zosh.issue_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserService userService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/{issueId}")
    public ResponseEntity<Issue> getIssueById(@PathVariable Long issueId) throws Exception {
        return ResponseEntity.ok(issueService.getIssueById(issueId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Issue>> getIssueByProjectId(@PathVariable Long projectId) throws Exception {
        return ResponseEntity.ok(issueService.getIssueByProjectId(projectId));
    }

    @PostMapping
    public ResponseEntity<Issue> createIssue(@RequestBody IssueRequest issue) throws Exception {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        User user = userService.findUserByEmail(email);
        Issue createdIssue = issueService.createIssue(issue, user);
        return ResponseEntity.ok(createdIssue);
    }

    @DeleteMapping("/{issueId}")
    public ResponseEntity<MessageResponse> deleteIssue(@PathVariable Long issueId) throws Exception {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        User user = userService.findUserByEmail(email);
        issueService.deleteIssue(issueId, user.getId());
        MessageResponse res = new MessageResponse("Issue deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("/{issueId}/screenshot")
    public ResponseEntity<Issue> uploadScreenshot(
            @PathVariable Long issueId,
            @RequestParam("file") MultipartFile file) throws Exception {
        String url = fileStorageService.save(file);
        Issue issue = issueService.getIssueById(issueId);
        issue.setScreenshotUrl(url);
        Issue updatedIssue = issueService.updateIssue(issueId, issue);
        return new ResponseEntity<>(updatedIssue, HttpStatus.OK);
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
