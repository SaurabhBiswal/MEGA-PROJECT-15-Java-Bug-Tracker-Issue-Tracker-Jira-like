package com.zosh.issue_tracker.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;
    private String description;
    private String status;
    private Long projectID; // Keeping it simple for now as requested in some patterns, but related Project
                            // is better
    private String priority;
    private LocalDate dueDate;

    @ElementCollection
    private List<String> tags = new ArrayList<>();

    @ManyToOne
    private User assignee;

    @JsonIgnore
    @ManyToOne
    private Project project;
}
