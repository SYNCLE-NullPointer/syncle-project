package com.nullpointer.domain.card.controller;

import com.nullpointer.domain.card.dto.MoveCardRequest;
import com.nullpointer.domain.card.dto.UpdateCardRequest;
import com.nullpointer.domain.card.service.CardService;
import com.nullpointer.global.common.ApiResponse;
import com.nullpointer.global.common.annotation.LoginUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardManageController {
    private final CardService cardService;

    // 카드 이동
    @PatchMapping("/{cardId}/move")
    public ApiResponse<String> moveCard(@PathVariable Long cardId,
                                        @RequestBody MoveCardRequest req,
                                        @LoginUser Long userId) {
        cardService.moveCard(cardId, req, userId);
        return ApiResponse.success("카드 이동 성공");
    }

    // 카드 수정
    @PatchMapping("/{cardId}")
    public ApiResponse<String> updateCard(@PathVariable Long cardId,
                                          @RequestBody UpdateCardRequest req,
                                          @LoginUser Long userId) {
        cardService.updateCard(cardId, req, userId);
        return ApiResponse.success("카드 정보 수정");
    }
}
