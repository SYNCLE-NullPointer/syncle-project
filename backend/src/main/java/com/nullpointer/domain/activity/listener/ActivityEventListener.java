package com.nullpointer.domain.activity.listener;

import com.nullpointer.domain.activity.dto.request.ActivitySaveRequest;
import com.nullpointer.domain.activity.service.ActivityService;
import com.nullpointer.domain.activity.vo.enums.ActivityType;
import com.nullpointer.domain.card.event.CardEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.util.StringUtils;

import java.time.format.DateTimeFormatter;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ActivityEventListener {

    private final ActivityService activityService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("M월 d일");

    /**
     * 카드 이벤트 활동 기록
     * - @TransactionalEventListener 커밋 성공 시에만 실행
     */
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCardEvent(CardEvent event) {
        // 단순 알림용 이벤트는 로깅 제외
        if (event.getEventType() == CardEvent.EventType.DEADLINE_NEAR ||
                event.getEventType() == CardEvent.EventType.MENTION) return;

        ActivityType type = mapToActivityType(event);
        String detailMsg = generateDetail(event);

        String finalDescription = StringUtils.hasText(detailMsg) ? detailMsg : type.getDescription();

        ActivitySaveRequest req = ActivitySaveRequest.builder()
                .userId(event.getActorId())
                .boardId(event.getBoardId())
                .teamId(event.getTeamId())
                .type(type)
                .targetId(event.getCardId())
                .targetName(event.getCardTitle())
                .description(finalDescription)
                .build();

        activityService.saveLog(req);
    }

    /**
     * 타입 변환
     * CardEvent -> ActivityType
     */
    private ActivityType mapToActivityType(CardEvent event) {
        Set<String> fields = event.getChangedFields();

        return switch (event.getEventType()) {
            // 생성, 이동, 삭제
            case CREATED -> ActivityType.CREATE_CARD;
            case MOVED -> ActivityType.MOVE_CARD;
            case DELETED -> ActivityType.DELETE_CARD;

            // 2. 댓글
            case COMMENT -> ActivityType.ADD_COMMENT; // Enum 이름 변경 반영
            case REPLY -> ActivityType.ADD_REPLY;

            // 3. 파일 첨부
            case ATTACHMENT -> ActivityType.UPLOAD_FILE;

            // 4. 체크리스트
            case CHECKLIST -> ActivityType.CHECKLIST_COMPLETED;

            // 5. 수정
            case UPDATED -> {
                // 완료 여부 변경
                if (fields.contains("COMPLETE")) {
                    yield Boolean.TRUE.equals(event.getIsComplete())
                            ? ActivityType.COMPLETE_CARD
                            : ActivityType.UNCOMPLETE_CARD;
                }
                // 마감일 변경
                if (fields.contains("DUE_DATE")) {
                    yield ActivityType.UPDATE_DUE_DATE;
                }
                // 중요도 변경
                if (fields.contains("PRIORITY")) {
                    yield ActivityType.UPDATE_PRIORITY;
                }
                // 아카이브 (보관) 변경
                if (fields.contains("ARCHIVE")) {
                    // CardEvent에 isArchived 필드가 있다고 가정하거나,
                    // 변경 로직에서 넘어온 값으로 판단
                    yield Boolean.TRUE.equals(event.getIsArchived())
                            ? ActivityType.ARCHIVE_CARD
                            : ActivityType.RESTORE_CARD;
                }

                // 그 외 일반 수정 (제목, 설명, 라벨 등)
                yield ActivityType.UPDATE_CARD;
            }

            // 담당자 변경은 보통 UPDATE_CARD로 처리하거나 별도 타입 추가
            case ASSIGNED -> ActivityType.UPDATE_CARD;

            // 그 외
            default -> ActivityType.UPDATE_CARD;
        };
    }

    /**
     * 로그에 보여줄 상세 메시지 작성
     */
    private String generateDetail(CardEvent event) {
        CardEvent.EventType type = event.getEventType();
        Set<String> fields = event.getChangedFields();

        return switch (type) {
            case CREATED -> "새로운 카드를 생성했습니다.";

            case MOVED -> {
                String prev = event.getPrevListTitle();
                String next = event.getListTitle();
                if (prev != null && next != null) {
                    yield String.format("리스트를 '%s'에서 '%s'로 이동했습니다.", prev, next);
                }
                yield "카드의 리스트를 이동했습니다.";
            }

            case UPDATED -> generateUpdateDetail(event, fields);

            case ATTACHMENT -> {
                String fileName = fields.stream().findFirst().orElse("파일");
                yield String.format("'%s' 파일을 첨부했습니다.", truncate(fileName, 20));
            }

            case CHECKLIST -> {
                String content = event.getChecklistContent();
                yield content != null
                        ? String.format("체크리스트 항목 '%s'을(를) 완료했습니다.", truncate(content, 15))
                        : "체크리스트 항목을 완료했습니다.";
            }

            case ASSIGNED -> {
                // 본인이 본인을 지정한 경우
                if (event.getActorId().equals(event.getAssigneeId())) {
                    yield "본인을 담당자로 지정했습니다.";
                }
                // 타인을 지정한 경우 (assigneeName 필드 활용 권장)
                String assigneeName = event.getAssigneeNickname(); // CardEvent에 추가 필요
                if (StringUtils.hasText(assigneeName)) {
                    yield String.format("'%s'님을 담당자로 지정했습니다.", assigneeName);
                }
                yield "담당자를 변경했습니다.";
            }

            case COMMENT -> "카드에 댓글을 남겼습니다.";

            case REPLY -> "댓글에 답글을 작성했습니다.";

            case DELETED -> "카드를 삭제했습니다.";

            default -> "";
        };
    }

    /**
     * UPDATED 이벤트 상세 메시지 처리
     */
    private String generateUpdateDetail(CardEvent event, Set<String> fields) {
        if (fields.contains("TITLE")) {
            return String.format("제목을 '%s'에서 '%s'(으)로 변경했습니다.",
                    truncate(event.getPrevTitle(), 10), truncate(event.getCardTitle(), 10));
        }
        if (fields.contains("DESCRIPTION")) {
            return "카드 본문 설명을 수정했습니다.";
        }

        // 라벨 변경
        if (fields.contains("LABEL")) {
            if (event.getLabel() == null) return "라벨을 삭제했습니다.";
            if (event.getPrevLabel() != null) {
                return String.format("라벨을 '%s'에서 '%s'(으)로 변경했습니다.", event.getPrevLabel(), event.getLabel());
            }
            return String.format("라벨 '%s'을(를) 추가했습니다.", event.getLabel());
        }

        // 중요도 변경
        if (fields.contains("PRIORITY")) {
            String newPriority = event.getPriority() != null ? event.getPriority().getLabel() : "없음";
            // prevPriority가 있다면: "중요도를 '낮음'에서 '높음'으로 변경했습니다."
            if (event.getPrevPriority() != null) {
                return String.format("중요도를 '%s'에서 '%s'(으)로 변경했습니다.",
                        event.getPrevPriority().getLabel(), newPriority);
            }
            return String.format("중요도를 '%s'(으)로 설정했습니다.", newPriority);
        }

        // 시작일 변경
        if (fields.contains("START_DATE")) {
            if (event.getStartDate() == null) return "시작일을 삭제했습니다.";
            String dateStr = event.getStartDate().format(DATE_FORMATTER);
            if (event.getPrevStartDate() != null) {
                String prevDateStr = event.getPrevStartDate().format(DATE_FORMATTER);
                return String.format("시작일을 %s에서 %s로 변경했습니다.", prevDateStr, dateStr);
            }
            return String.format("시작일을 %s로 설정했습니다.", dateStr);
        }

        // 마감일 변경
        if (fields.contains("DUE_DATE")) {
            if (event.getDueDate() == null) return "마감일을 삭제했습니다.";
            String dateStr = event.getDueDate().format(DATE_FORMATTER);
            if (event.getPrevDueDate() != null) {
                String prevDateStr = event.getPrevDueDate().format(DATE_FORMATTER);
                return String.format("마감일을 %s에서 %s로 변경했습니다.", prevDateStr, dateStr);
            }
            return String.format("마감일을 %s로 설정했습니다.", dateStr);
        }

        // 완료 여부
        if (fields.contains("COMPLETE")) {
            return Boolean.TRUE.equals(event.getIsComplete())
                    ? "카드를 완료 상태로 변경했습니다."
                    : "카드의 완료 처리를 취소했습니다.";
        }

        // 아카이브
        if (fields.contains("ARCHIVE")) {
            return Boolean.TRUE.equals(event.getIsArchived())
                    ? "카드를 보관함으로 이동시켰습니다."
                    : "보관된 카드를 다시 복구했습니다.";
        }

        return "카드 정보를 수정했습니다.";
    }

    private String truncate(String str, int length) {
        if (str == null) return "";
        return str.length() > length ? str.substring(0, length - 3) + "..." : str;
    }

}
