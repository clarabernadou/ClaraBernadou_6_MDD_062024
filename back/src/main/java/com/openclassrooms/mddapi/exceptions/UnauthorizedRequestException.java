package com.openclassrooms.mddapi.exceptions;

public class UnauthorizedRequestException extends GlobalException {
    private static final long serialVersionUID = 1L;

    public UnauthorizedRequestException(String message) {
        super(message, 400);
    }

    public UnauthorizedRequestException(String message, Throwable cause) {
        super(message, 400, cause);
    }
}