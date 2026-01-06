package com.nullpointer.domain.user.service;

import com.nullpointer.domain.auth.dto.request.AuthRequest;
import com.nullpointer.domain.auth.dto.request.PasswordRequest;
import com.nullpointer.domain.user.dto.request.UpdateProfileRequest;
import com.nullpointer.domain.user.dto.response.UserProfileResponse;
import com.nullpointer.domain.user.dto.response.UserSummaryResponse;

import java.util.List;

public interface UserService {

    // 이메일 중복 확인
    boolean existsByEmail(String email);

    // 닉네임 중복 확인
    boolean existsByNickname(String nickname);

    // 내 정보 조회
    UserProfileResponse getUserProfile(Long id);

    // 내 정보 수정
    void updateProfile(Long id, UpdateProfileRequest req);

    // 비밀번호 변경
    void changePassword(Long id, PasswordRequest.Change req);

    // 사용자 요약 정보 조회
    UserSummaryResponse getUserSummary(Long userId);

    // 사용자 검색
    List<UserSummaryResponse> searchUsers(String keyword);

    // 계정 비활성화 (데이터 유지, 복구 가능)
    void deactivateUser(Long id, String accessToken);

    // 계정 활성화 (데이터 유지, 복구 가능)
    void reactivateUser(AuthRequest.Login req);

    // 계정 삭제 (복구 불가)
    void deleteUser(Long id);

}
