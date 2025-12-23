package com.nullpointer.domain.board.vo;

import com.nullpointer.domain.board.vo.enums.PermissionLevel;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardSettingVo {
    private Long boardId;
    @Builder.Default
    private PermissionLevel invitationPermission = PermissionLevel.OWNER;
    @Builder.Default
    private PermissionLevel boardSharingPermission = PermissionLevel.OWNER;
    @Builder.Default
    private PermissionLevel listEditPermission = PermissionLevel.OWNER;
    @Builder.Default
    private PermissionLevel cardDeletePermission = PermissionLevel.OWNER;
}