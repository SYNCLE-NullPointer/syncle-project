package com.nullpointer.domain.checklist.vo;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistVo {
    private Long id;
    private Long cardId;
    private String title;
    private Boolean done;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
