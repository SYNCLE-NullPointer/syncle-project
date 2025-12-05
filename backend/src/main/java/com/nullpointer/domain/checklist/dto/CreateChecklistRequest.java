package com.nullpointer.domain.checklist.dto;

import com.nullpointer.domain.checklist.vo.ChecklistVo;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CreateChecklistRequest {
    private String title;

    public ChecklistVo toVo(Long cardId) {
        return ChecklistVo.builder()
                .cardId(cardId)
                .title(this.title)
                .build();
    }
}