package com.openclassrooms.mddapi.exceptions;

public class BadRequestException extends GlobalException {
    private static final long serialVersionUID = 1L;

    public BadRequestException(String message) {
        super(message, 400);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, 400, cause);
    }
}