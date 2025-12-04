package com.nullpointer.domain.card.mapper;

import com.nullpointer.domain.card.dto.CardResponse;
import com.nullpointer.domain.card.vo.CardVo;
import io.lettuce.core.dynamic.annotation.Param;
import org.apache.ibatis.annotations.Mapper;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

/**
 * card 테이블과 통신하는 MyBatis Mapper
 */
@Mapper
public interface CardMapper {

    // 카드 생성
    void insertCard(CardVo cardVo);

    // 특정 리스트의 카드 목록 조회
    List<CardResponse> findCardsWithDetailsByListId(Long listId);

    // 카드 이동
    void updateCardLocation(CardVo cardVo);

    // 카드 조회
    Optional<CardVo> findById(Long id);

    // 순서 재정렬
    void updateOrderIndex(@Param("listId") Long listId,
                          @Param("startOrder") int startOrder,
                          @Param("endOrder") int endOrder,
                          @Param("updateValue") int updateValue);
}
