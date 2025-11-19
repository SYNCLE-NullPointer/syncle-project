package com.nullpointer.global.exception;

import com.nullpointer.global.common.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 비즈니스 예외 처리
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        log.warn("도메인 오류 발생: errorCode={}, message={}", errorCode.getCode(), ex.getMessage());

        ApiResponse<Void> body = ApiResponse.error(errorCode);

        return new ResponseEntity<>(body, errorCode.getStatus());
    }

    /**
     * @Valid, @Validated 바인딩 실패 (DTO 필드 검증 오류)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        StringBuilder sb = new StringBuilder();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            sb.append(error.getField())
                    .append(" : ")
                    .append(error.getDefaultMessage())
                    .append("; ");
        });

        String detailMessage = sb.toString();
        log.warn("DTO 필드 유효성 검증 오류 발생: {}", detailMessage);

        ApiResponse<Void> body = ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE);

        return new ResponseEntity<>(body, ErrorCode.INVALID_INPUT_VALUE.getStatus());
    }

//    /**
//     * 단일 파라미터 검증 실패(@RequestParam, @PathVariable 등)
//     */
//    @ExceptionHandler({ BindException.class, ConstraintViolationException.class })
//    public ResponseEntity<ApiResponse<Void>> handleBindException(Exception ex) {
//        log.warn("Bind/ConstraintViolationException: {}", ex.getMessage());
//
//        ApiResponse<Void> body = ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, ex.getMessage());
//        return new ResponseEntity<>(body, ErrorCode.INVALID_INPUT_VALUE.getStatus());
//    }
//
//    /**
//     * 지원하지 않는 HTTP 메서드 요청
//     */
//    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
//    public ResponseEntity<ApiResponse<Void>> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException ex) {
//        log.warn("HttpRequestMethodNotSupportedException: {}", ex.getMessage());
//
//        ApiResponse<Void> body = ApiResponse.error(ErrorCode.METHOD_NOT_ALLOWED);
//        return new ResponseEntity<>(body, ErrorCode.METHOD_NOT_ALLOWED.getStatus());
//    }
//
//    /**
//     * JSON 파싱 오류 등 바디 형식이 잘못된 경우
//     */
//    @ExceptionHandler(HttpMessageNotReadableException.class)
//    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
//        log.warn("HttpMessageNotReadableException: {}", ex.getMessage());
//
//        ApiResponse<Void> body = ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, "요청 본문 형식이 올바르지 않습니다.");
//        return new ResponseEntity<>(body, ErrorCode.INVALID_INPUT_VALUE.getStatus());
//    }
//
//    /**
//     * Spring Security 인가 예외 (권한 부족)
//     */
//    @ExceptionHandler(AccessDeniedException.class)
//    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException ex) {
//        log.warn("AccessDeniedException: {}", ex.getMessage());
//
//        ApiResponse<Void> body = ApiResponse.error(ErrorCode.ACCESS_DENIED);
//        return new ResponseEntity<>(body, ErrorCode.ACCESS_DENIED.getStatus());
//    }


    /**
     * 나머지 예외 처리 (서버 오류)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception ex) {
        log.error("서버 오류 발생: ", ex);

        ApiResponse<Void> body = ApiResponse.error(ErrorCode.INTERNAL_SERVER_ERROR);

        return new ResponseEntity<>(body, ErrorCode.INTERNAL_SERVER_ERROR.getStatus());
    }

}
