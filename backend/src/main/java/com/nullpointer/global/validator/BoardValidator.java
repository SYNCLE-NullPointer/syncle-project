package com.nullpointer.global.validator;

import com.nullpointer.domain.board.mapper.BoardMapper;
import com.nullpointer.domain.board.vo.BoardVo;
import com.nullpointer.domain.member.mapper.BoardMemberMapper;
import com.nullpointer.global.common.enums.ErrorCode;
import com.nullpointer.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BoardValidator {
    private final BoardMapper boardMapper;
    private final BoardMemberMapper boardMemberMapper;
    // ========================================================
    //  1. 리소스 존재 및 유효성 확인
    // ========================================================

    /**
     * 유효한 보드 가져오기
     */
    public BoardVo getValidBoard(Long boardId) {
        BoardVo board = boardMapper.findBoardByBoardId(boardId);
        if (board == null) {
            throw new BusinessException(ErrorCode.BOARD_NOT_FOUND);
        }
        if (board.getDeletedAt() != null) {
            throw new BusinessException(ErrorCode.BOARD_DELETED);
        }
        return board;
    }

    /**
     * 보드 권한 체크
     */
    public void hasAccess(Long boardId, Long userId) {
        if (!boardMemberMapper.hasAccessToBoard(boardId, userId)) {
            throw new BusinessException(ErrorCode.BOARD_ACCESS_DENIED);
        }
    }
}
