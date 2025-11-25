package com.nullpointer.domain.card.service;

import com.nullpointer.domain.card.dto.CardResponse;
import com.nullpointer.domain.card.dto.CreateCardRequest;

import java.util.List;

public interface CardService {

    // 카드 생성
    CardResponse createCard(Long listId, CreateCardRequest request);

    // 카드 목록 조회
    List<CardResponse> getCards(Long listId);
}
