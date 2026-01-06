package com.nullpointer.global.common.enums;

import lombok.Getter;

@Getter
public enum VerificationType {

    SIGNUP("회원가입"),
    PASSWORD_RESET("비밀번호 재설정"),
    EMAIL_LINK("이메일 링크 인증");

    private final String label;

    VerificationType(String label) {
        this.label = label;
    }

}
