package com.openclassrooms.mddapi.exceptions;

public class GlobalException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    private final int errorCode;

    public GlobalException(String message) {
        super(message);
        this.errorCode = 0;
    }

    public GlobalException(String message, int errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public GlobalException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = 0;
    }

    public GlobalException(String message, int errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public int getErrorCode() {
        return errorCode;
    }
}
