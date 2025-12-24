package com.nullpointer.domain.support;

import com.nullpointer.domain.support.dto.InquiryRequest;
import com.nullpointer.global.common.ApiResponse;
import com.nullpointer.global.common.annotation.LoginUser;
import com.nullpointer.global.email.EmailService;
import com.nullpointer.global.security.jwt.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/support")
public class SupportController {

    private final EmailService emailService;

    @PostMapping("/inquiry")
    public ApiResponse<String> sendInquiry(@LoginUser CustomUserDetails userDetails,
                                         @RequestBody InquiryRequest request) {
        emailService.sendInquiryEmail(userDetails.getUsername(), request.getType(), request.getTitle(), request.getContent());
        return ApiResponse.success("문의메일 발송");
    }
}