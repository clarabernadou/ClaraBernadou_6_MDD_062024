package com.openclassrooms.mddapi.exceptions;

public class NotFoundException extends GlobalException {
    private static final long serialVersionUID = 1L;

    public NotFoundException(String message) {
        super(message, 404);
    }

    public NotFoundException(String message, Throwable cause) {
        super(message, 404, cause);
    }
}
