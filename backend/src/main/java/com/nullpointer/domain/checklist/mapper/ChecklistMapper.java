package com.nullpointer.domain.checklist.mapper;

import com.nullpointer.domain.checklist.vo.ChecklistVo;

import java.util.List;
import java.util.Optional;

public interface ChecklistMapper {
    // 체크리스트 생성
    void insertChecklist(ChecklistVo checklistVo);

    // 조회 (특정 카드의 아이템 목록)
    List<ChecklistVo> findByCardId(Long cardId);

    // 체크리스트 수정
    void updateChecklist(ChecklistVo checklistVo);

    // 체크리스트 삭제
    void deleteChecklist(Long checklistId);

    // 카드ID 조회
    Optional<ChecklistVo> findById(Long checklistId);
}
