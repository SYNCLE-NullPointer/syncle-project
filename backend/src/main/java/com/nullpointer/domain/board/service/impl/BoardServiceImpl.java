package com.nullpointer.domain.board.service.impl;

import com.nullpointer.domain.board.dto.request.CreateBoardRequest;
import com.nullpointer.domain.board.dto.request.UpdateBoardRequest;
import com.nullpointer.domain.board.dto.response.BoardDetailResponse;
import com.nullpointer.domain.board.dto.response.BoardResponse;
import com.nullpointer.domain.board.mapper.BoardMapper;
import com.nullpointer.domain.board.service.BoardService;
import com.nullpointer.domain.board.vo.BoardVo;
import com.nullpointer.domain.member.mapper.BoardMemberMapper;
import com.nullpointer.domain.member.vo.BoardMemberVo;
import com.nullpointer.domain.member.vo.enums.Role;
import com.nullpointer.global.common.enums.ErrorCode;
import com.nullpointer.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardMapper boardMapper;
    private final BoardMemberMapper boardMemberMapper;

    @Override
    @Transactional
    public void createBoard(Long teamId, CreateBoardRequest req, Long userId) {

        // 팀 소속 여부 확인


        // 보드 개수 제한 체크 (팀당 최대 10개)
        int currentBoardCount = boardMapper.countBoardByTeamId(teamId);
        if (currentBoardCount >= 10) {
            throw new BusinessException(ErrorCode.BOARD_LIMIT_EXCEEDED);
        }

        // 보드 VO 생성 (DTO -> VO)
        BoardVo boardVo = req.toVo(teamId);

        boardMapper.insertBoard(boardVo);

        // 2. 방금 만든 보드 ID 가져오기
        Long createBoardId = boardVo.getId();

        // 3. 보드 멤버 VO 생성 (DTO -> VO)
        BoardMemberVo boardMemberVo = BoardMemberVo.builder().boardId(createBoardId).userId(userId).role(Role.OWNER).build();

        boardMemberMapper.insertBoardMember(boardMemberVo);
    }

    @Override
    public List<BoardResponse> getMyBoards(Long userId) {
        List<BoardVo> boards = boardMapper.findBoardByUserId(userId);
        return boards.stream().map(BoardResponse::from).toList();
    }

    @Override
    public List<BoardResponse> getTeamBoards(Long teamId) {
        List<BoardVo> boards = boardMapper.findBoardByTeamId(teamId);
        return boards.stream().map(BoardResponse::from).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BoardDetailResponse getBoardDetail(Long boardId) {
        // 1. 공통 검증 메서드로 보드 조회
        BoardVo boardVo = findValidBoard(boardId);
        return BoardDetailResponse.from(boardVo);
    }

    @Override
    @Transactional
    public void updateBoard(Long boardId, UpdateBoardRequest req, Long userId) {

        // 1. 공통 검증 메서드로 보드 조회
        BoardVo boardVo = findValidBoard(boardId);

        // 2. 권한 체크 (TODO 부분)
        validateOwner(boardId, userId);

        BoardVo vo = req.toVo(boardId);
        boardMapper.updateBoard(vo);
    }

    @Override
    @Transactional
    public void deleteBoard(Long boardId, Long userId) {
        // 1. 공통 검증 메서드로 보드 조회
        findValidBoard(boardId);

//        // 2. 권한 체크 (TODO 부분)
//        validateOwner(boardId, userId);

        // 3. 삭제 진행
        boardMapper.deleteBoard(boardId);
    }


    /**
     * 보드가 존재하는지, 삭제되지 않았는지 검증 후 반환
     */

    private BoardVo findValidBoard(Long boardId) {
        BoardVo board = boardMapper.findBoardByBoardId(boardId);

        // 1. 물리적 존재 여부 (DB에 아예 없는 경우)
        if (board == null) {
            throw new BusinessException(ErrorCode.BOARD_NOT_FOUND);
        }

        // 2. 논리적 삭제 여부 (Soft Delete 된 경우)
        if (board.getDeletedAt() != null) {
            throw new BusinessException(ErrorCode.BOARD_DELETED);
        }

        return board;
    }

    /**
     * role(OWNER) 검증
     */

    private void validateOwner(Long boardId, Long userId) {
        // TODO: 실제 구현 시 주석 해제
        // BoardMemberVo member = boardMemberMapper.findMember(boardId, userId);
        // if (member == null || !member.getRole().equals(Role.OWNER)) {
        //     throw new BusinessException(ErrorCode.BOARD_UPDATE_FORBIDDEN); // 혹은 ACCESS_DENIED
        // }
    }
}
