package com.nullpointer.domain.list.service.impl;

import com.nullpointer.domain.list.dto.CreateListRequest;
import com.nullpointer.domain.list.dto.ListResponse;
import com.nullpointer.domain.list.mapper.ListMapper;
import com.nullpointer.domain.list.service.ListService;
import com.nullpointer.domain.list.vo.ListVo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 리스트 생성/조회 로직 구현체
 */
@Service
public class ListServiceImpl implements ListService {

    private final ListMapper listMapper;

    public ListServiceImpl(ListMapper listMapper) {
        this.listMapper = listMapper;
    }

    @Override
    @Transactional
    public ListResponse createList(Long boardId, CreateListRequest request) {
        // 1. DB에 넣을 VO 만들기
        ListVo listVo = new ListVo();
        listVo.setBoardId(boardId);
        listVo.setTitle(request.getTitle());

        // 2. INSERT 실행 (id 채워짐)
        listMapper.insertList(listVo);

        // 3. 응답 DTO 생성
        ListResponse response = new ListResponse();
        response.setId(listVo.getId());
        response.setBoardId(listVo.getBoardId());
        response.setTitle(listVo.getTitle());
        response.setOrderIndex(listVo.getOrderIndex()); // 지금은 0 (INSERT 시 0 넣었음)

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListResponse> getLists(Long boardId) {
        // 1. DB에서 VO 목록 조회
        List<ListVo> voList = listMapper.findByBoardId(boardId);

        // 2. VO → Response 로 변환
        List<ListResponse> responseList = new ArrayList<>();
        for (ListVo vo : voList) {
            ListResponse res = new ListResponse();
            res.setId(vo.getId());
            res.setBoardId(vo.getBoardId());
            res.setTitle(vo.getTitle());
            res.setOrderIndex(vo.getOrderIndex());
            responseList.add(res);
        }

        return responseList;
    }
}
