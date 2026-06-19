package com.interviewed.cv;

import com.interviewed.cv.dto.CvExtractResponse;
import com.interviewed.shared.exception.CvParsingException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class CvParsingService {

    private static final Logger log = LoggerFactory.getLogger(CvParsingService.class);
    private static final long MAX_BYTES = 5L * 1024 * 1024;

    private static final List<String> CV_KEYWORDS = List.of(
        "experience", "education", "skills", "summary", "objective",
        "work history", "employment", "curriculum vitae", "resume",
        "university", "bachelor", "master", "degree", "gpa",
        "project", "intern", "engineer", "developer", "designer",
        "manager", "analyst", "certification", "achievement",
        "responsibility", "qualification", "profile", "contact",
        "phone", "email", "linkedin", "github", "portfolio"
    );

    public CvExtractResponse extractText(MultipartFile file) {
        if (file.getSize() > MAX_BYTES) {
            throw new CvParsingException("File too large. Maximum size is 5MB");
        }
        String contentType = file.getContentType();
        String text;
        if ("application/pdf".equals(contentType) || (file.getOriginalFilename() != null && file.getOriginalFilename().endsWith(".pdf"))) {
            text = extractFromPdf(file);
        } else if (isDocx(contentType, file.getOriginalFilename())) {
            text = extractFromDocx(file);
        } else {
            throw new CvParsingException("Unsupported file type. Upload PDF or DOCX");
        }
        if (text == null || text.isBlank()) {
            throw new CvParsingException("File is empty or unreadable. Please upload a valid CV document");
        }
        String preview = text.length() > 500 ? text.substring(0, 500) + "..." : text;
        CvValidation validation = validateCv(text);
        log.info("cv.parse bytes={} looksLikeCv={} hits={}/{}",
            file.getSize(), validation.looksLikeCv(), validation.hits(), CV_KEYWORDS.size());
        return new CvExtractResponse(preview, text, validation.looksLikeCv(), validation.warning());
    }

    private CvValidation validateCv(String text) {
        String lower = text.toLowerCase(Locale.ROOT);
        int hits = 0;
        for (String kw : CV_KEYWORDS) {
            if (lower.contains(kw)) {
                hits++;
            }
        }
        boolean looksLikeCv = hits >= 4;
        String warning = null;
        if (!looksLikeCv) {
            warning = "This document does not appear to be a CV or resume. "
                + "We detected only " + hits + " of " + CV_KEYWORDS.size()
                + " typical CV keywords. You can still continue, but the AI profile analysis "
                + "will likely produce poor results. Please upload your actual CV/resume.";
        }
        return new CvValidation(looksLikeCv, hits, warning);
    }

    private record CvValidation(boolean looksLikeCv, int hits, String warning) {}

    private boolean isDocx(String contentType, String filename) {
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document".equals(contentType)
            || (filename != null && filename.endsWith(".docx"));
    }

    private String extractFromPdf(MultipartFile file) {
        try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
            return new PDFTextStripper().getText(doc);
        } catch (IOException ex) {
            throw new CvParsingException("Failed to parse PDF", ex);
        }
    }

    private String extractFromDocx(MultipartFile file) {
        try (XWPFDocument doc = new XWPFDocument(file.getInputStream())) {
            return doc.getParagraphs().stream()
                .map(XWPFParagraph::getText)
                .collect(Collectors.joining("\n"));
        } catch (IOException ex) {
            throw new CvParsingException("Failed to parse DOCX", ex);
        }
    }
}
