package com.nullpointer.domain.activity.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogResponse {

    /**
     * 타임라인 로그용
     */
    private Long id;
    private String type;
    private String description;
    private String targetName;

    private String boardTitle;
    private String teamName;

    private String actorName;
    private String actorProfileImg;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

}
