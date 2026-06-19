package com.interviewed.interview;

import com.interviewed.auth.CurrentUserService;
import com.interviewed.interview.dto.AnswerRequest;
import com.interviewed.interview.dto.AnswerResponse;
import com.interviewed.interview.dto.InterviewSessionResponse;
import com.interviewed.interview.dto.StartInterviewResponse;
import com.interviewed.shared.web.ApiResponse;
import com.interviewed.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final CurrentUserService currentUserService;
    private final InterviewService interviewService;

    @PostMapping("/start")
    public ApiResponse<StartInterviewResponse> start() {
        User user = currentUserService.requireCurrentUser();
        return ApiResponse.ok(interviewService.startInterviewSession(user.getId()));
    }

    @PostMapping("/{id}/answer")
    public ApiResponse<AnswerResponse> answer(@PathVariable Long id, @Valid @RequestBody AnswerRequest request) {
        User user = currentUserService.requireCurrentUser();
        return ApiResponse.ok(interviewService.recordAnswer(user.getId(), id, request.text()));
    }

    @GetMapping("/{id}")
    public ApiResponse<InterviewSessionResponse> getSession(@PathVariable Long id) {
        User user = currentUserService.requireCurrentUser();
        return ApiResponse.ok(interviewService.getSession(user.getId(), id));
    }
}
