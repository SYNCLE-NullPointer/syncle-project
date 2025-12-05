package com.nullpointer.domain.card.dto;

import com.nullpointer.domain.card.vo.CardVo;
import com.nullpointer.domain.card.vo.enums.Priority;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UpdateCardRequest {
    private String title;
    private String description;
    private Priority priority;
    private LocalDateTime startDate;
    private LocalDateTime dueDate;

    public CardVo toVo(Long cardId) {
        return CardVo.builder()
                .id(cardId)
                .title(this.title)
                .description(this.description)
                .priority(this.priority)
                .startDate(this.startDate)
                .dueDate(this.dueDate)
                .build();
    }
}
