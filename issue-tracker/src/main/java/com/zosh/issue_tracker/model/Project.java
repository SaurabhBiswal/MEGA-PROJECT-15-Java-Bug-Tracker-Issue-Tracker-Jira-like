package com.zosh.issue_tracker.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "it_projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String category;

    @ElementCollection
    @CollectionTable(name = "it_project_tags", joinColumns = @JoinColumn(name = "project_id"))
    private List<String> tags = new ArrayList<>();

    @JsonIgnore
    @OneToOne(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Chat chat;

    @ManyToOne
    private User owner;

    @ManyToMany
    @JoinTable(name = "it_project_team", joinColumns = @JoinColumn(name = "project_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> team = new ArrayList<>();
}
