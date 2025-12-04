package com.nullpointer.domain.card.dto;


import com.nullpointer.domain.card.vo.CardVo;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateCardRequest {

    private String title;
    private String description;

    public CardVo toVo() {
        return CardVo.builder()
                .title(this.title)
                .description(this.description)
                .build();
    }

}
