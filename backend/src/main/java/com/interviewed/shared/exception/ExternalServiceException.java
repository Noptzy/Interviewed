package com.interviewed.shared.exception;

public class ExternalServiceException extends RuntimeException {
    public ExternalServiceException(String service, String message) {
        super(service + " error: " + message);
    }

    public ExternalServiceException(String service, String message, Throwable cause) {
        super(service + " error: " + message, cause);
    }
}
