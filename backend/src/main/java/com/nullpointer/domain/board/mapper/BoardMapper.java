package com.nullpointer.domain.board.mapper;


import com.nullpointer.domain.board.vo.BoardVo;
import io.lettuce.core.dynamic.annotation.Param;

import java.util.List;

public interface BoardMapper {

    // 보드 추가하기
    void insertBoard(BoardVo board);

    void insertBoardMember(@Param("boardId") Long boardId,
                           @Param("userId") Long userId,
                           @Param("role") String role);

    // 내 보드 목록 조회
    List<BoardVo> findBoardById(Long user_id);

}
