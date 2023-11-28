// package com.example.talktopia_chat.common.exception;
//
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.AccessDeniedException;
// import org.springframework.web.bind.annotation.ControllerAdvice;
// import org.springframework.web.bind.annotation.ExceptionHandler;
//
// import lombok.extern.slf4j.Slf4j;
//
// @ControllerAdvice
// @Slf4j
// public class GlobalExceptionHandler {
//
//     @ExceptionHandler(AccessDeniedException.class)
//     protected ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException e) {
//         log.error("handleAccessDeniedException", e);
//         final ErrorResponse response = ErrorResponse.of(ErrorCode.HANDLE_ACCESS_DENIED);
//         return new ResponseEntity<>(response, HttpStatus.valueOf(ErrorCode.HANDLE_ACCESS_DENIED.getStatus()));
//     }
//
//     @ExceptionHandler(ExceptionSample.class)
//     protected ResponseEntity<ErrorResponse> handleExceptionSample(final ExceptionSample e) {
//         log.error("handleBusinessException", e);
//         final ErrorCode errorCode = e.getErrorCode();
//         final ErrorResponse response = ErrorResponse.of(errorCode);
//         return new ResponseEntity<>(response, HttpStatus.valueOf(errorCode.getStatus()));
//     }
//
//     @ExceptionHandler(Exception.class)
//     protected ResponseEntity<ErrorResponse> handleException(Exception e) {
//         log.error("handleException", e);
//         final ErrorResponse response = ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR);
//         return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
// }