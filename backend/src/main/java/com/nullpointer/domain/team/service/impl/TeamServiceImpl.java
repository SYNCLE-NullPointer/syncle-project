package com.nullpointer.domain.team.service.impl;

import com.nullpointer.domain.member.mapper.TeamMemberMapper;
import com.nullpointer.domain.member.vo.TeamMemberVo;
import com.nullpointer.domain.member.vo.enums.InvitationStatus;
import com.nullpointer.domain.member.vo.enums.Role;
import com.nullpointer.domain.team.dto.CreateTeamRequest;
import com.nullpointer.domain.team.dto.TeamResponse;
import com.nullpointer.domain.team.mapper.TeamMapper;
import com.nullpointer.domain.team.service.TeamService;
import com.nullpointer.domain.team.vo.TeamVo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamMapper teamMapper;
    private final TeamMemberMapper teamMemberMapper;

    @Override
    @Transactional
    public void createTeam(CreateTeamRequest req, Long userId) {

        // 1. 팀 VO 생성 (DTO -> VO)
        TeamVo teamVo = TeamVo.builder()
                .name(req.getName())
                .description(req.getDescription())
                .build();

        teamMapper.insertTeam(teamVo);

        // 2. 방금 만든 팀 ID 가져오기
        Long createTeamId = teamVo.getId();

        // 3. 팀 멤버 VO 생성 (DTO -> VO)
        TeamMemberVo teamMemberVo = TeamMemberVo.builder()
                .teamId(createTeamId)
                .userId(userId)
                .role(Role.OWNER)
                .invitationStatus(InvitationStatus.ACTIVE)
                .build();

        teamMemberMapper.insertTeamMember(teamMemberVo);
    }

    @Override
    public List<TeamResponse> getTeams(Long userId) {
        List<TeamVo> teams = teamMapper.findTeamById(userId);
        return teams.stream().map(TeamResponse::from).toList();
    }
}
