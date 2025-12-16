package com.nullpointer.domain.checklist.service;

import com.nullpointer.domain.checklist.dto.CreateChecklistRequest;
import com.nullpointer.domain.checklist.dto.UpdateChecklistRequest;
import com.nullpointer.domain.checklist.vo.ChecklistVo;

import java.util.List;

public interface ChecklistService {

    // 체크리스트 추가
    Long createChecklist(Long cardId, CreateChecklistRequest req, Long userId);

    // 체크리스트 조회
    List<ChecklistVo> getChecklists(Long cardId, Long userId);

    // 체크리스트 수정
    void updateChecklist(Long checklistId, UpdateChecklistRequest req, Long userId);

    // 체크리스트 삭제
    void deleteChecklist(Long checklistId, Long userId);

}
