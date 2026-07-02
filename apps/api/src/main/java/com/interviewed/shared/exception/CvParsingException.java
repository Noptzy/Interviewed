package com.interviewed.shared.exception;

public class CvParsingException extends RuntimeException {
    public CvParsingException(String message) {
        super(message);
    }

    public CvParsingException(String message, Throwable cause) {
        super(message, cause);
    }
}
