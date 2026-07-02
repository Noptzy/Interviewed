package com.interviewed;

import com.interviewed.shared.web.ApiResponse;
import com.interviewed.shared.exception.ProfileNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class InterviewedApplicationTests {

    @Test
    @DisplayName("ApiResponse.ok wraps data correctly")
    void apiResponse_ok_wrapsData() {
        ApiResponse<String> response = ApiResponse.ok("hello");
        assertThat(response.success()).isTrue();
        assertThat(response.data()).isEqualTo("hello");
        assertThat(response.error()).isNull();
    }

    @Test
    @DisplayName("ApiResponse.error wraps message correctly")
    void apiResponse_error_wrapsMessage() {
        ApiResponse<Void> response = ApiResponse.error("something went wrong");
        assertThat(response.success()).isFalse();
        assertThat(response.data()).isNull();
        assertThat(response.error()).isEqualTo("something went wrong");
    }

    @Test
    @DisplayName("ProfileNotFoundException carries userId in message")
    void profileNotFoundException_hasCorrectMessage() {
        ProfileNotFoundException ex = new ProfileNotFoundException(42L);
        assertThat(ex.getMessage()).contains("42");
    }
}
