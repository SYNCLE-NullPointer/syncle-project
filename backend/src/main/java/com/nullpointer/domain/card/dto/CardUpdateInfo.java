package com.nullpointer.domain.card.dto;

import com.nullpointer.domain.card.vo.enums.Priority;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Builder
public class CardUpdateInfo {

    // 변경된 필드 목록
    private Set<String> changedFields;

    // 담당자 변경 여부
    private boolean isAssigneeChanged;
    // 변경된 담당자의 닉네임
    private String assigneeNickname;

    // 변경 전 데이터
    private String prevTitle;
    private String prevLabel;
    private Priority prevPriority;
    private LocalDateTime prevDueDate;
    private LocalDateTime prevStartDate;

}
