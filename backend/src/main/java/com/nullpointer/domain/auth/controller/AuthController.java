package com.nullpointer.domain.auth.controller;

import com.nullpointer.global.exception.BusinessException;
import com.nullpointer.global.exception.ErrorCode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class AuthController {

    /**
     * 1) BusinessException 강제 발생
     */
    @GetMapping("/business")
    public String throwBusinessException() {
        throw new BusinessException(ErrorCode.BOARD_NOT_FOUND);
    }

    /**
     * 2) @Valid 검증 실패 테스트
     * → MethodArgumentNotValidException 발생
     */
    @PostMapping("/valid")
    public String throwValidException(@Valid @RequestBody SampleRequest request) {
        return "OK";
    }

    public static class SampleRequest {
        @NotBlank(message = "name은 필수 값입니다.")
        private String name;

        @Min(value = 1, message = "age는 1 이상이어야 합니다.")
        private int age;

        public String getName() {
            return name;
        }

        public int getAge() {
            return age;
        }
    }

    /**
     * 3) ConstraintViolationException 테스트 (@RequestParam)
     */
    @GetMapping("/param")
    public String throwConstraintViolation(@RequestParam @Min(1) int id) {
        return "OK";
    }

    /**
     * 4) NullPointerException 등 일반 Exception 테스트
     */
    @GetMapping("/exception")
    public String throwGeneralException() {
        throw new NullPointerException("테스트용 NPE");
    }
    
}
