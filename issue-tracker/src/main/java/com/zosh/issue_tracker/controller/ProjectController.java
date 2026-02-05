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
            @RequestParam(required = false) String tag,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwt(jwt);
        List<Project> projects = projectService.getProjectByTeam(user, category, tag);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(
            @PathVariable Long projectId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        // Just validating token
        userService.findUserByJwt(jwt);
        Project project = projectService.getProjectById(projectId);
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Project> createProject(
            @RequestBody Project project,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwt(jwt);
        Project createdProject = projectService.createProject(project, user);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }

    @PatchMapping("/{projectId}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long projectId,
            @RequestBody Project project,
            @RequestHeader("Authorization") String jwt) throws Exception {
        userService.findUserByJwt(jwt);
        Project updatedProject = projectService.updateProject(project, projectId);
        return new ResponseEntity<>(updatedProject, HttpStatus.OK);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<MessageResponse> deleteProject(
            @PathVariable Long projectId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwt(jwt);
        projectService.deleteProject(projectId, user.getId());
        MessageResponse res = new MessageResponse("project deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Project>> searchProjects(
            @RequestParam(required = false) String keyword,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwt(jwt);
        List<Project> projects = projectService.searchProjects(keyword, user);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @GetMapping("/{projectId}/chat")
    public ResponseEntity<Chat> getChatByProjectId(
            @PathVariable Long projectId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        userService.findUserByJwt(jwt);
        Chat chat = projectService.getChatByProjectId(projectId);
        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @PostMapping("/{projectId}/invite")
    public ResponseEntity<MessageResponse> inviteProject(
            @RequestHeader("Authorization") String jwt,
            @RequestParam String email,
            @PathVariable Long projectId) throws Exception {
        // Invite logic might be better placed in service, but for now we'll handle just
        // adding user to team
        // NOTE: The previous plan was to use userId for add/remove, but email is more
        // user-friendly for invites.
        // Let's stick to the previous plan but I'll use email here as it's more
        // realistic for an invite system.
        // Actually, let's implement the generic add user via ID as well if needed, but
        // email is better.
        // Wait, the plan said "Add user to team". I'll implement "invite" via email.

        userService.findUserByJwt(jwt);
        User user = userService.findUserByEmail(email);
        projectService.addUserToProject(projectId, user.getId());
        MessageResponse res = new MessageResponse("user invited to the project");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
