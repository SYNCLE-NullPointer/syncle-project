package com.nullpointer.domain.team.service;

import com.nullpointer.domain.team.dto.CreateTeamRequest;
import com.nullpointer.domain.team.dto.TeamResponse;

import java.util.List;

public interface TeamService {

    // 팀 생성
    void createTeam(CreateTeamRequest req, Long userId);

    // 팀 조회
    List<TeamResponse> getTeams(Long userId);
}
