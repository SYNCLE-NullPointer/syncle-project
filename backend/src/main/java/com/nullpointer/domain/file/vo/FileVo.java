package com.nullpointer.domain.file.vo;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class FileVo {
    private Long id;
    private Long cardId;
    private Long uploaderId;
    private String fileName;
    private String filePath;     // Key 값
    private Long fileSize;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;
}