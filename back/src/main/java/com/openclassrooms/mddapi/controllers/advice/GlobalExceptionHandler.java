package com.openclassrooms.mddapi.controllers.advice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.openclassrooms.mddapi.controllers.advice.exceptions.BadRequestException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.ConflictException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.NotFoundException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.UnauthorizedException;

import javax.validation.*;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<String> handleValidationException(ValidationException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleBadRequestException(BadRequestException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<String> handleUnauthorizedException(UnauthorizedException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFoundException(NotFoundException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<String> handleConflictException(ConflictException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
    }
}
