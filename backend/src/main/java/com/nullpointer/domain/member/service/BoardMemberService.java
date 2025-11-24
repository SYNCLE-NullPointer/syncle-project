package com.nullpointer.domain.member.service;

import com.nullpointer.domain.member.dto.board.BoardInviteRequest;
import com.nullpointer.domain.member.dto.board.BoardMemberResponse;

import java.util.List;

public interface BoardMemberService {

    // 보드 멤버 초대
    void inviteBoardMember(BoardInviteRequest req);

    // 보드 멤버 조회
    List<BoardMemberResponse> getBoardMembers(Long boardId);
}
