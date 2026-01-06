package com.nullpointer.domain.board.dto.response;

import com.nullpointer.domain.board.vo.enums.PermissionLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateBoardSettingRequest {
    private PermissionLevel invitation;
    private PermissionLevel boardSharing;
    private PermissionLevel listEdit;
    private PermissionLevel cardDelete;
}
