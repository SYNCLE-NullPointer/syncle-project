package com.nullpointer.domain.team.controller;

import com.nullpointer.domain.team.dto.CreateTeamRequest;
import com.nullpointer.domain.team.dto.TeamResponse;
import com.nullpointer.domain.team.service.TeamService;
import com.nullpointer.global.common.ApiResponse;
import com.nullpointer.global.security.jwt.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor

public class TeamController {

    private final TeamService teamService;

    // 팀 생성
    @PostMapping("/teams")
    public ApiResponse<String> createTeam(@RequestBody CreateTeamRequest req,
                                          @AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user.getUserId();
        teamService.createTeam(req, userId);
        return ApiResponse.success("팀 추가 성공");
    }

    // 팀 조회
    @GetMapping("/teams")
    public ApiResponse<List<TeamResponse>> getTeams(@AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user.getUserId();
        return ApiResponse.success(teamService.getTeams(userId));
    }
}
