package com.nullpointer.domain.card.controller;

import com.nullpointer.domain.card.dto.MoveCardRequest;
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
                                        @LoginUser Long userId){
        cardService.moveCard(cardId, req, userId);
        return ApiResponse.success("카드 이동 성공");
    }
}
