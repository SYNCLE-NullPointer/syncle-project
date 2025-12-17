package com.nullpointer.domain.file.dto;

import com.nullpointer.domain.file.vo.FileVo;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FileResponse {
    private Long id;
    private Long cardId;
    private Long uploaderId;
    private String fileName;
    private Long fileSize;
    private String filePath;
    private String fileDownloadUrl;
    private LocalDateTime createdAt;

    public static FileResponse of(FileVo vo, String fileDownloadUrl) {
        return FileResponse.builder()
                .id(vo.getId())
                .cardId(vo.getCardId())
                .uploaderId(vo.getUploaderId())
                .fileName(vo.getFileName())
                .fileSize(vo.getFileSize())
                .filePath(fileDownloadUrl)
                .createdAt(vo.getCreatedAt())
                .build();
    }
}
