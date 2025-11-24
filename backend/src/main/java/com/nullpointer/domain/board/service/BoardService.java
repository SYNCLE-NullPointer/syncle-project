package com.nullpointer.domain.board.service;

import com.nullpointer.domain.board.dto.response.BoardResponse;
import com.nullpointer.domain.board.dto.request.CreateBoardRequest;

import java.util.List;

public interface BoardService {

    // 보드 생성
    void createBoard(Long teamId, Long userId, CreateBoardRequest req);

    // 내 보드 조회
    List<BoardResponse> getMyBoards(Long userId);

}
