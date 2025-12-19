package com.nullpointer.domain.auth.service;

import com.nullpointer.global.common.enums.VerificationType;

public interface EmailService {

    // 인증 코드 발송
    void sendVerificationEmail(String toEmail, String code, VerificationType type);

    // 인증 링크 발송
    void sendVerificationLink(String toEmail, String token);
    
}
