package com.nullpointer.domain.board.dto.response;

import com.nullpointer.domain.board.vo.BoardSettingVo;
import com.nullpointer.domain.board.vo.BoardVo;
import com.nullpointer.domain.board.vo.enums.PermissionLevel;
import com.nullpointer.domain.board.vo.enums.Visibility;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder

public class BoardDetailResponse {
    private Long id;
    private Long teamId;
    private String title;
    private String description;
    private Visibility visibility;

    // 보드 권한 설정 필드
    private PermissionLevel invitationPermission;
    private PermissionLevel boardSharingPermission;
    private PermissionLevel listEditPermission;
    private PermissionLevel cardDeletePermission;

    public static BoardDetailResponse from(BoardVo board, BoardSettingVo setting) {
        return BoardDetailResponse.builder()
                .id(board.getId())
                .teamId(board.getTeamId())
                .title(board.getTitle())
                .description(board.getDescription())
                .visibility(board.getVisibility())
                .invitationPermission(setting.getInvitationPermission())
                .boardSharingPermission(setting.getBoardSharingPermission())
                .listEditPermission(setting.getListEditPermission())
                .cardDeletePermission(setting.getCardDeletePermission())
                .build();
    }
}