package com.openclassrooms.mddapi.controllers.advice.exceptions;

public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
