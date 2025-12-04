package com.nullpointer.domain.card.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MoveCardRequest {
    private Long id;
    private Long listId;
    private Integer orderIndex;

}
