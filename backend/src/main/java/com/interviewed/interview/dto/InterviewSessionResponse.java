package com.interviewed.interview.dto;

import com.interviewed.interview.InterviewMessage;
import com.interviewed.interview.InterviewSession;

import java.time.LocalDateTime;
import java.util.List;

public record InterviewSessionResponse(
    Long id,
    String status,
    List<MessageDto> messages
) {
    public record MessageDto(Long id, String role, String content, LocalDateTime createdAt) {
        public static MessageDto from(InterviewMessage m) {
            return new MessageDto(m.getId(), m.getRole().name(), m.getContent(), m.getCreatedAt());
        }
    }

    public static InterviewSessionResponse from(InterviewSession session, List<InterviewMessage> messages) {
        return new InterviewSessionResponse(
            session.getId(),
            session.getStatus().name(),
            messages.stream().map(MessageDto::from).toList()
        );
    }
}
