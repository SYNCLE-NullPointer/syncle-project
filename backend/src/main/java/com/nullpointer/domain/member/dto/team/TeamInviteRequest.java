package com.nullpointer.domain.member.dto.team;

import com.nullpointer.domain.member.vo.enums.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor

public class TeamInviteRequest {
    private Long teamId;
    private List<Long> userIds;
    private Role role;
}
