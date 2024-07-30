package com.openclassrooms.mddapi.controllers.advice.exceptions;

public class InvalidCredentialException extends RuntimeException {
    public InvalidCredentialException(String message) {
        super(message);
    }
}
