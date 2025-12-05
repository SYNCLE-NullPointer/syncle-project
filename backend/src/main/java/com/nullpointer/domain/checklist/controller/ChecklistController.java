package com.nullpointer.domain.checklist.controller;

import com.nullpointer.domain.checklist.dto.CreateChecklistRequest;
import com.nullpointer.domain.checklist.dto.UpdateChecklistRequest;
import com.nullpointer.domain.checklist.service.ChecklistService;
import com.nullpointer.domain.checklist.vo.ChecklistVo;
import com.nullpointer.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChecklistController {
    private final ChecklistService checklistService;

    // 체크리스트 추가
    @PostMapping("/cards/{cardId}/checklists")
    public ApiResponse<Long> createCheckList(@PathVariable Long cardId,
                                             @RequestBody CreateChecklistRequest req) {
        Long checklistId = checklistService.createChecklist(cardId, req);
        return ApiResponse.success(checklistId);
    }

    // 특정 카드의 체크리스트 목록 조회
    @GetMapping("/cards/{cardId}/checklists")
    public ApiResponse<List<ChecklistVo>> getChecklists(@PathVariable Long cardId) {
        return ApiResponse.success(checklistService.getChecklists(cardId));
    }

    // 3. 체크리스트 수정 (완료 토글, 내용 수정)
    @PatchMapping("/checklists/{checklistId}")
    public ApiResponse<String> updateChecklist(@PathVariable Long checklistId,
                                             @RequestBody UpdateChecklistRequest req) {
        checklistService.updateChecklist(checklistId, req);
        return ApiResponse.success("체크리스트 수정 성공");
    }

    // 4. 체크리스트 삭제
    @DeleteMapping("/checklists/{checklistId}")
    public ApiResponse<String> deleteChecklist(@PathVariable Long checklistId) {
        checklistService.deleteChecklist(checklistId);
        return ApiResponse.success("체크리스트 삭제 성공");
    }
}
