package com.nullpointer.domain.card.dto;

import com.nullpointer.domain.card.vo.CardVo;
import lombok.Builder;
import lombok.Setter;

@Setter
@Builder
public class MoveCardRequest {
    private Long id;
    private Long listId;
    private Integer orderIndex;

    public static CardVo toVo(Long cardId, MoveCardRequest req) {
        return CardVo.builder()
                .id(cardId)
                .listId(req.listId)
                .orderIndex(req.orderIndex)
                .build();
    }
}
