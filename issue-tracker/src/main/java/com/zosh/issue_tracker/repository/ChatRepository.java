package com.zosh.issue_tracker.repository;

import com.zosh.issue_tracker.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {
}
