package com.nullpointer.domain.checklist.service.impl;

import com.nullpointer.domain.card.mapper.CardMapper;
import com.nullpointer.domain.checklist.dto.CreateChecklistRequest;
import com.nullpointer.domain.checklist.dto.UpdateChecklistRequest;
import com.nullpointer.domain.checklist.mapper.ChecklistMapper;
import com.nullpointer.domain.checklist.service.ChecklistService;
import com.nullpointer.domain.checklist.vo.ChecklistVo;
import com.nullpointer.global.common.SocketSender;
import com.nullpointer.global.common.enums.ErrorCode;
import com.nullpointer.global.exception.BusinessException;
import com.nullpointer.global.validator.CardValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChecklistServiceImpl implements ChecklistService {

    private final ChecklistMapper checklistMapper;
    private final CardValidator cardVal;
    private final SocketSender socketSender;

    @Override
    @Transactional
    public Long createChecklist(Long cardId, CreateChecklistRequest req, Long userId) {
        // 카드 유효성 확인
        cardVal.getValidCard(cardId);

        // dto -> vo 변환
        ChecklistVo checklistVo = req.toVo(cardId);

        // 체크리스트 추가
        checklistMapper.insertChecklist(checklistVo);

        // 보드 ID 조회 및 소켓 전송
        Long boardId = cardVal.findBoardIdByCardId(cardId);
        socketSender.sendSocketMessage(boardId,"CHECKLIST_CREATE", userId, null);

        return checklistVo.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChecklistVo> getChecklists(Long cardId) {
        return checklistMapper.findByCardId(cardId);
    }

    @Override
    @Transactional
    public void updateChecklist(Long checklistId, UpdateChecklistRequest req, Long userId) {
        // 체크리스트 조회
        ChecklistVo checklist = checklistMapper.findById(checklistId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHECKLIST_NOT_FOUND));

        // 업데이트
        ChecklistVo updateVo = req.toVo(checklistId);
        checklistMapper.updateChecklist(updateVo);

        // 보드 ID 조회 및 소켓 전송
        Long boardId = cardVal.findBoardIdByCardId(checklist.getCardId());
        socketSender.sendSocketMessage(boardId, "CHECKLIST_UPDATE", userId, null);
    }

    @Override
    @Transactional
    public void deleteChecklist(Long checklistId, Long userId) {
        // 체크리스트 조회
        ChecklistVo checklist = checklistMapper.findById(checklistId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHECKLIST_NOT_FOUND));

        checklistMapper.deleteChecklist(checklistId);

        // 보드 ID 조회 및 소켓 전송
        Long boardId = cardVal.findBoardIdByCardId(checklist.getCardId());
        socketSender.sendSocketMessage(boardId,"CHECKLIST_CREATE", userId, null);
    }
}
