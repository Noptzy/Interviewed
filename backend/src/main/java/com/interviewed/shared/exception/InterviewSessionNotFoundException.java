package com.interviewed.shared.exception;

public class InterviewSessionNotFoundException extends RuntimeException {
    public InterviewSessionNotFoundException(Long sessionId) {
        super("Interview session not found: id=" + sessionId);
    }
}
