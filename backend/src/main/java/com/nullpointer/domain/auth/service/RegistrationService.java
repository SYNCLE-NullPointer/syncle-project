package com.nullpointer.domain.auth.service;

import com.nullpointer.domain.user.dto.SignupRequest;
import com.nullpointer.domain.user.vo.UserVo;

public interface RegistrationService {

    RegistrationResult registerLocalUser(SignupRequest req);

    // 단순 데이터(immutable) 전달이 목적이기 때문에 record 사용
    record RegistrationResult(UserVo user, String emailVerificationToken) {
    }

}
