package com.nullpointer.domain.member.controller;

import com.nullpointer.domain.member.dto.team.TeamInviteRequest;
import com.nullpointer.domain.member.service.TeamMemberService;
import com.nullpointer.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor

public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    // 팀 멤버 초대
    @PostMapping("/{teamId}/members")
    public ApiResponse<String> inviteTeamMember(@PathVariable Long teamId,
                                            @Valid @RequestBody TeamInviteRequest req) {

        req.setTeamId(teamId);
        
        teamMemberService.inviteTeamMember(req);
        return ApiResponse.success("팀 멤버 초대 성공");
    }

    // 팀 멤버 조회
    @GetMapping("/{teamId}/members")
    public ApiResponse<?> getTeamMembers(@PathVariable Long teamId) {
        return ApiResponse.success(teamMemberService.getTeamMembers(teamId));
    }

}
