package com.nullpointer.domain.board.mapper;

import com.nullpointer.domain.board.vo.BoardSettingVo;

public interface BoardSettingMapper {
    // 보드 설정 생성 (보드 생성 시 호출)
    void insertBoardSettings(BoardSettingVo settingsVo);

    // 보드 설정 조회
    BoardSettingVo findBoardSettingsByBoardId(Long boardId);

    // 보드 설정 수정
    void updateBoardSettings(BoardSettingVo settingsVo);
}
