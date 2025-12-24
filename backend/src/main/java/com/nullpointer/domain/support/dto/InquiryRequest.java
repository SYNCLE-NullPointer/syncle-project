package com.nullpointer.domain.support.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class InquiryRequest {
    private String type;    // 문의 종류
    private String title;   // 제목
    private String content; // 내용
}