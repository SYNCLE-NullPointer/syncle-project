package com.nullpointer.domain.checklist.dto;

import com.nullpointer.domain.checklist.vo.ChecklistVo;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateChecklistRequest {
    private String title;
    private Boolean done;

    public ChecklistVo toVo(Long checklistId) {
        return ChecklistVo.builder()
                .id(checklistId)
                .title(this.title)
                .done(this.done)
                .build();
    }
}