package com.nullpointer.domain.team.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CreateTeamRequest {
    @NotBlank(message = "팀 이름은 필수입니다.")
    @Size(max = 30, message = "팀 이름은 최대 30자까지 가능합니다.")
    private String name;

    @Size(max = 1000, message = "설명은 최대 1000자까지 가능합니다.")
    private String description;
}
