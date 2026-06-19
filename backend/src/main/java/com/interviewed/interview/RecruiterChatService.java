package com.interviewed.interview;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewed.ai.ChatClientFactory;
import com.interviewed.interview.dto.AnswerResponse;
import com.interviewed.interview.prompt.InterviewPrompts;
import com.interviewed.profile.CandidateProfile;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecruiterChatService {

    private static final Logger log = LoggerFactory.getLogger(RecruiterChatService.class);
    private static final int MAX_TURNS = 8;
    private static final int MIN_TURNS = 3;

    private final ChatClientFactory chatClientFactory;
    private final ObjectMapper objectMapper;

    public AnswerResponse askNextQuestion(Long userId, CandidateProfile profile, List<InterviewMessage> history) {
        int turnCount = (int) history.stream().filter(m -> m.getRole() == InterviewMessage.MessageRole.USER).count();
        if (turnCount >= MAX_TURNS) {
            return new AnswerResponse("Thank you for your time. I have all the information I need. Your profile has been updated.", true);
        }

        String systemPrompt = InterviewPrompts.systemPrompt(profile.getSummary(), profile.getSkillsJson());
        StringBuilder conversation = new StringBuilder();
        for (InterviewMessage msg : history) {
            conversation.append(msg.getRole().name()).append(": ").append(msg.getContent()).append("\n");
        }

        log.info("ai.interview.turn userId={} turn={}", userId, turnCount + 1);

        String raw = chatClientFactory.forUser(userId)
            .prompt()
            .system(systemPrompt)
            .user(conversation + "\nRespond with JSON only.")
            .call()
            .content();

        return parseResponse(raw, turnCount);
    }

    private AnswerResponse parseResponse(String raw, int turnCount) {
        try {
            String cleaned = raw.strip();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replaceAll("^```[a-z]*\\n?", "").replaceAll("```$", "").strip();
            }
            JsonNode node = objectMapper.readTree(cleaned);
            String question = node.path("question").asText("Thank you for sharing. Let's continue.");
            boolean complete = node.path("complete").asBoolean(false);
            if (complete && turnCount < MIN_TURNS) {
                complete = false;
            }
            return new AnswerResponse(question, complete);
        } catch (Exception ex) {
            return new AnswerResponse(raw, false);
        }
    }
}
