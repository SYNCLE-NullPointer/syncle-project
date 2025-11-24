package com.nullpointer.domain.member.controller;

import com.nullpointer.domain.member.dto.board.BoardInviteRequest;
import com.nullpointer.domain.member.service.BoardMemberService;
import com.nullpointer.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardMemberController {

    private final BoardMemberService boardMemberService;

    // 보드 멤버 초대
    @PostMapping("/{boardId}/members")
    public ApiResponse<String> inviteBoardMember(@PathVariable Long boardId,
                                                @Valid @RequestBody BoardInviteRequest req) {

        req.setBoardId(boardId);

        boardMemberService.inviteBoardMember(req);
        return ApiResponse.success("보드 멤버 초대 성공");
    }

    // 보드 멤버 조회
    @GetMapping("/{boardId}/members")
    public ApiResponse<?> getBoardMembers(@PathVariable Long boardId) {
        return ApiResponse.success(boardMemberService.getBoardMembers(boardId));
    }
}
