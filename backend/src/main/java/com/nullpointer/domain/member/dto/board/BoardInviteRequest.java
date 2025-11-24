package com.nullpointer.domain.member.dto.board;

import com.nullpointer.domain.member.vo.enums.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor

public class BoardInviteRequest {
    private Long boardId;
    private List<Long> userIds;
    private Role role;
}
