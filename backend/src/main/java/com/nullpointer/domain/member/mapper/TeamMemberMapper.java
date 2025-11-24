package com.nullpointer.domain.member.mapper;

import java.util.List;

import com.nullpointer.domain.member.dto.team.TeamMemberResponse;
import com.nullpointer.domain.member.vo.TeamMemberVo;


public interface TeamMemberMapper {

    // 팀 멤버 초대
    void insertTeamMember(TeamMemberVo teamMemberVo);

    // 팀 멤버 조회
    List<TeamMemberResponse> findMembersByTeamId(Long teamId);
}
