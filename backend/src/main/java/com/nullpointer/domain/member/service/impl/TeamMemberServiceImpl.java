package com.nullpointer.domain.member.service.impl;

import com.nullpointer.domain.member.dto.team.TeamInviteRequest;
import com.nullpointer.domain.member.dto.team.TeamMemberResponse;
import com.nullpointer.domain.member.mapper.TeamMemberMapper;
import com.nullpointer.domain.member.service.TeamMemberService;
import com.nullpointer.domain.member.vo.TeamMemberVo;
import lombok.Builder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Builder

public class TeamMemberServiceImpl implements TeamMemberService {

    private final TeamMemberMapper teamMemberMapper;

    @Override
    public void inviteTeamMember(TeamInviteRequest req) {
        for (Long userId : req.getUserIds()) {
            TeamMemberVo vo = TeamMemberVo.builder()
                    .teamId(req.getTeamId())
                    .userId(userId)
                    .role(req.getRole())
                    .build();

            teamMemberMapper.insertTeamMember(vo);
        }
    }

    @Override
    public List<TeamMemberResponse> getTeamMembers(Long teamId) {
        return teamMemberMapper.findMembersByTeamId(teamId);
    }
}
