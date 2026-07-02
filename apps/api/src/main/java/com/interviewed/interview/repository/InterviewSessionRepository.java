package com.interviewed.interview.repository;

import com.interviewed.interview.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByUserId(Long userId);
    Optional<InterviewSession> findByIdAndUserId(Long id, Long userId);
    long countByStatus(InterviewSession.SessionStatus status);
}
