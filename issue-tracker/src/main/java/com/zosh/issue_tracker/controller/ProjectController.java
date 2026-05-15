package com.zosh.issue_tracker.controller;

import com.zosh.issue_tracker.model.Chat;
import com.zosh.issue_tracker.model.Project;
import com.zosh.issue_tracker.model.User;
import com.zosh.issue_tracker.response.MessageResponse;
import com.zosh.issue_tracker.service.ProjectService;
import com.zosh.issue_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Project>> getProjects(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag) throws Exception {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        User user = userService.findUserByEmail(email);
        List<Project> projects = projectService.getProjectByTeam(user, category, tag);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(
            @PathVariable Long projectId) throws Exception {
        Project project = projectService.getProjectById(projectId);
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Project> createProject(
            @RequestBody Project project) throws Exception {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        User user = userService.findUserByEmail(email);
        Project createdProject = projectService.createProject(project, user);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }

    @PatchMapping("/{projectId}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long projectId,
            @RequestBody Project project) throws Exception {
        Project updatedProject = projectService.updateProject(project, projectId);
        return new ResponseEntity<>(updatedProject, HttpStatus.OK);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<MessageResponse> deleteProject(
            @PathVariable Long projectId) throws Exception {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        User user = userService.findUserByEmail(email);
        projectService.deleteProject(projectId, user.getId());
        MessageResponse res = new MessageResponse("project deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Project>> searchProjects(
            @RequestParam(required = false) String keyword) throws Exception {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        User user = userService.findUserByEmail(email);
        List<Project> projects = projectService.searchProjects(keyword, user);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @GetMapping("/{projectId}/chat")
    public ResponseEntity<Chat> getChatByProjectId(
            @PathVariable Long projectId) throws Exception {
        Chat chat = projectService.getChatByProjectId(projectId);
        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @Autowired
    private com.zosh.issue_tracker.service.EmailService emailService;

    @PostMapping("/{projectId}/invite")
    public ResponseEntity<MessageResponse> inviteProject(
            @RequestParam String email,
            @PathVariable Long projectId) throws Exception {
        User user = userService.findUserByEmail(email);
        projectService.addUserToProject(projectId, user.getId());

        Project project = projectService.getProjectById(projectId);
        emailService.sendEmail(email, "Project Invitation",
                "You have been invited to join the project: " + project.getName()
                        + ".\nCheck it out on your dashboard!");

        MessageResponse res = new MessageResponse("user invited to the project");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
