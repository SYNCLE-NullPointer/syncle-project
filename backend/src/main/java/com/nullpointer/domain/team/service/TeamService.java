package com.nullpointer.domain.team.service;

import com.nullpointer.domain.team.dto.request.CreateTeamRequest;
import com.nullpointer.domain.team.dto.response.TeamDetailResponse;
import com.nullpointer.domain.team.dto.response.TeamResponse;
import com.nullpointer.domain.team.dto.request.UpdateTeamRequest;

import java.util.List;

public interface TeamService {

    // 팀 생성
    void createTeam(CreateTeamRequest req, Long userId);

    // 본인 소속 팀 조회
    List<TeamResponse> getTeams(Long userId);

    // 팀 상세 조회
    TeamDetailResponse getTeamDetail(Long teamId);

    // 팀 정보 수정
    void updateTeam(Long teamId, UpdateTeamRequest req, Long userId);

    // 팀 삭제
    void deleteTeam(Long teamId, Long userId);
}
