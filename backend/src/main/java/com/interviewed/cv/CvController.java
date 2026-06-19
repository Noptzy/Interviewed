package com.interviewed.cv;

import com.interviewed.cv.dto.CvExtractResponse;
import com.interviewed.shared.web.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
public class CvController {

    private final CvParsingService cvParsingService;

    @PostMapping("/upload")
    public ApiResponse<CvExtractResponse> upload(@RequestParam("file") MultipartFile file) {
        return ApiResponse.ok(cvParsingService.extractText(file));
    }
}
