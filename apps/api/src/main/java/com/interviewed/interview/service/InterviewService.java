package com.interviewed.interview.service;

import com.interviewed.interview.dto.AnswerResponse;
import com.interviewed.interview.dto.InterviewSessionResponse;
import com.interviewed.interview.dto.StartInterviewResponse;
import com.interviewed.interview.entity.InterviewMessage;
import com.interviewed.interview.entity.InterviewSession;
import com.interviewed.interview.repository.InterviewMessageRepository;
import com.interviewed.interview.repository.InterviewSessionRepository;
import com.interviewed.profile.entity.CandidateProfile;
import com.interviewed.profile.repository.CandidateProfileRepository;
import com.interviewed.profile.service.ProfileAnalysisService;
import com.interviewed.shared.exception.InterviewSessionNotFoundException;
import com.interviewed.shared.exception.ProfileNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private static final Logger log = LoggerFactory.getLogger(InterviewService.class);

    private final InterviewSessionRepository sessionRepository;
    private final InterviewMessageRepository messageRepository;
    private final RecruiterChatService recruiterChatService;
    private final CandidateProfileRepository candidateProfileRepository;
    private final ProfileAnalysisService profileAnalysisService;

    public StartInterviewResponse startInterviewSession(Long userId) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ProfileNotFoundException(userId));

        InterviewSession session = InterviewSession.builder()
            .userId(userId)
            .status(InterviewSession.SessionStatus.IN_PROGRESS)
            .build();
        InterviewSession saved = sessionRepository.save(session);

        log.info("interview.start userId={} sessionId={}", userId, saved.getId());

        AnswerResponse first = recruiterChatService.askNextQuestion(userId, profile, List.of());
        messageRepository.save(InterviewMessage.builder()
            .sessionId(saved.getId())
            .role(InterviewMessage.MessageRole.AI)
            .content(first.question())
            .build());

        return new StartInterviewResponse(saved.getId(), first.question());
    }

    public AnswerResponse recordAnswer(Long userId, Long sessionId, String answerText) {
        InterviewSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new InterviewSessionNotFoundException(sessionId));

        messageRepository.save(InterviewMessage.builder()
            .sessionId(sessionId)
            .role(InterviewMessage.MessageRole.USER)
            .content(answerText)
            .build());

        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ProfileNotFoundException(userId));

        List<InterviewMessage> history = messageRepository.findBySessionIdOrderByCreatedAt(sessionId);
        AnswerResponse response = recruiterChatService.askNextQuestion(userId, profile, history);

        messageRepository.save(InterviewMessage.builder()
            .sessionId(sessionId)
            .role(InterviewMessage.MessageRole.AI)
            .content(response.question())
            .build());

        if (response.complete()) {
            session.setStatus(InterviewSession.SessionStatus.COMPLETED);
            session.setCompletedAt(LocalDateTime.now());
            sessionRepository.save(session);
            log.info("interview.complete userId={} sessionId={}", userId, sessionId);
            updateProfileFromTranscript(userId, sessionId);
        }

        return response;
    }

    public InterviewSessionResponse getSession(Long userId, Long sessionId) {
        InterviewSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new InterviewSessionNotFoundException(sessionId));
        List<InterviewMessage> messages = messageRepository.findBySessionIdOrderByCreatedAt(sessionId);
        return InterviewSessionResponse.from(session, messages);
    }

    private void updateProfileFromTranscript(Long userId, Long sessionId) {
        List<InterviewMessage> messages = messageRepository.findBySessionIdOrderByCreatedAt(sessionId);
        String transcript = messages.stream()
            .map(m -> m.getRole().name() + ": [interview content]")
            .reduce("", (a, b) -> a + "\n" + b);
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId).orElse(null);
        if (profile != null) {
            profile.setIsCompleted(true);
            candidateProfileRepository.save(profile);
        }
    }
}
