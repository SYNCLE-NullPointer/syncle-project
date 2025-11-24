package com.nullpointer.domain.member.mapper;

import com.nullpointer.domain.member.dto.board.BoardMemberResponse;
import com.nullpointer.domain.member.vo.BoardMemberVo;

import java.util.List;

public interface BoardMemberMapper {

    // 보드 멤버 초대
    void insertBoardMember(BoardMemberVo boardMemberVo);

    // 보드 멤버 조회
    List<BoardMemberResponse> findMembersByBoardId(Long boardId);
}
