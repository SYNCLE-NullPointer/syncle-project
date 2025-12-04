package com.nullpointer.domain.card.service.impl;

import com.nullpointer.domain.card.dto.CardResponse;
import com.nullpointer.domain.card.dto.CreateCardRequest;
import com.nullpointer.domain.card.dto.MoveCardRequest;
import com.nullpointer.domain.card.mapper.CardMapper;
import com.nullpointer.domain.card.service.CardService;
import com.nullpointer.domain.card.vo.CardVo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardMapper cardMapper;

    @Override
    @Transactional
    public Long createCard(Long listId, CreateCardRequest req, Long userId) {

        // 1. 카드 VO 생성 (DTO -> VO)
        CardVo cardVo = req.toVo();
        cardVo.setListId(listId);
        cardVo.setAssigneeId(userId);

        cardMapper.insertCard(cardVo);
        return cardVo.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CardResponse> getCards(Long listId) {
        return cardMapper.findCardsWithDetailsByListId(listId);
    }

    // 카드 이동

    @Override
    public void moveCard(Long cardId, MoveCardRequest req, Long userId) {
        CardVo cardVo = MoveCardRequest.toVo(cardId, req);
        cardMapper.updateCardLocation(cardVo);
    }
}
