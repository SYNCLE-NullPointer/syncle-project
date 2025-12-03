package com.nullpointer.domain.card.service.impl;

import com.nullpointer.domain.card.dto.CardResponse;
import com.nullpointer.domain.card.dto.CreateCardRequest;
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
    public void createCard(Long listId, CreateCardRequest req, Long userId) {

        // 1. 카드 VO 생성 (DTO -> VO)
        CardVo cardVo = req.toVo();
        cardMapper.insertCard(cardVo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CardResponse> getCards(Long listId) {
        return cardMapper.findCardsWithDetailsByListId(listId);
    }
}
