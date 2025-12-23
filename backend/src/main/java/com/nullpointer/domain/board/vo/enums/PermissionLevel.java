package com.nullpointer.domain.board.vo.enums;

import lombok.Getter;

@Getter
public enum PermissionLevel {
    OWNER("관리자만"),
    MEMBERS("멤버 모두");

    private final String label;

    PermissionLevel(String label) {
        this.label = label;
    }
}
