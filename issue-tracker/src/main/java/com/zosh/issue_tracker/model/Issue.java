package com.zosh.issue_tracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "it_issues")
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String status;
    private Long projectID; // Keeping it simple for now as requested in some patterns, but related Project
                            // is better
    private String priority;
    private LocalDate dueDate;
    private String screenshotUrl;

    @ElementCollection
    @CollectionTable(name = "it_issue_tags", joinColumns = @JoinColumn(name = "issue_id"))
    private List<String> tags = new ArrayList<>();

    @ManyToOne
    private User assignee;

    @ManyToOne
    private Project project;
}
