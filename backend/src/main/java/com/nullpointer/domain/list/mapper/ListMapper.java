package com.nullpointer.domain.list.mapper;

import com.nullpointer.domain.list.vo.ListVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * list 테이블과 통신하는 MyBatis Mapper 인터페이스
 */
@Mapper
public interface ListMapper {

    // 리스트 1개 생성
    void insertList(ListVo listVo);

    // 특정 보드의 리스트 목록 조회
    List<ListVo> findByBoardId(Long boardId);
}
