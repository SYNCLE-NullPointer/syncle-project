package com.nullpointer.global.common.annotation;

import com.nullpointer.global.security.jwt.CustomUserDetails;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class LoginUserArgumentResolver implements HandlerMethodArgumentResolver {

    // 1. 이 리졸버가 지원하는 파라미터인지 검사
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        boolean hasAnnotation = parameter.hasParameterAnnotation(LoginUser.class);
        Class<?> paramType = parameter.getParameterType();
        // Long 타입 또는 CustomUserDetails 타입을 모두 지원하도록 수정
        return hasAnnotation && (Long.class.isAssignableFrom(paramType) || CustomUserDetails.class.isAssignableFrom(paramType));
    }

    // 2. 실제로 파라미터에 넣어줄 값을 생성
    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            // 파라미터 타입에 따라 다른 값 반환
            if (Long.class.isAssignableFrom(parameter.getParameterType())) {
                return userDetails.getUserId();
            } else if (CustomUserDetails.class.isAssignableFrom(parameter.getParameterType())) {
                return userDetails; // CustomUserDetails 객체 자체를 반환
            }
        }

        // 인증되지 않은 경우 null 반환 (필요 시 예외 발생 가능)
        return null;
    }
}
