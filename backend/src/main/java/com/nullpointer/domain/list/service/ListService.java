package com.nullpointer.domain.list.service;

import com.nullpointer.domain.list.dto.CreateListRequest;
import com.nullpointer.domain.list.dto.ListResponse;

import java.util.List;

/**
 * 리스트 관련 비즈니스 로직 인터페이스
 */
public interface ListService {

    // 리스트 생성
    ListResponse createList(Long boardId, CreateListRequest request);

    // 리스트 목록 조회
    List<ListResponse> getLists(Long boardId);
}
