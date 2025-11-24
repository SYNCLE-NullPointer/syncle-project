package com.nullpointer.domain.board.controller;

import com.nullpointer.domain.board.dto.response.BoardResponse;
import com.nullpointer.domain.board.dto.request.CreateBoardRequest;
import com.nullpointer.domain.board.service.BoardService;
import com.nullpointer.global.common.ApiResponse;
import com.nullpointer.global.security.jwt.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor

public class BoardController {

    private final BoardService boardService;

    // 보드 생성
    @PostMapping("/teams/{teamId}/boards")
    public ApiResponse<String> createBoard(@PathVariable Long teamId,
                                           @Valid @RequestBody CreateBoardRequest req,
                                            @AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user.getUserId();
        boardService.createBoard(teamId, userId, req);
        return ApiResponse.success("보드 추가 성공");
    }

    // 내 보드 조회
    @GetMapping("/boards")
    public ApiResponse<List<BoardResponse>> getMyBoards(@AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user.getUserId();
        return ApiResponse.success(boardService.getMyBoards(userId));
    }

}
