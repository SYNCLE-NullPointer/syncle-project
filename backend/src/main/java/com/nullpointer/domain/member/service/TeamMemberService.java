package com.nullpointer.domain.member.service;

import com.nullpointer.domain.member.dto.team.TeamInviteRequest;
import com.nullpointer.domain.member.dto.team.TeamMemberResponse;

import java.util.List;

public interface TeamMemberService {

    // 팀 멤버 초대
    void inviteTeamMember(TeamInviteRequest req);
    
    // 팀 멤버 조회
    List<TeamMemberResponse> getTeamMembers(Long teamId);

}
