package com.nullpointer.global.common;

import com.nullpointer.domain.socket.dto.SocketBoardMessage;
import com.nullpointer.domain.socket.dto.SocketTeamMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SocketSender {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendTeamSocketMessage(Long teamId, String type, Long senderId, Object data) {
        SocketTeamMessage message = SocketTeamMessage.builder()
                .type(type)
                .teamId(teamId)
                .senderId(senderId)
                .data(data)
                .build();

        messagingTemplate.convertAndSend("/topic/team/" + teamId, message);
    }

    public void sendSocketMessage(Long boardId, String type, Long senderId, Object data) {
        SocketBoardMessage message = SocketBoardMessage.builder()
                .type(type)
                .boardId(boardId)
                .senderId(senderId)
                .data(data)
                .build();
        messagingTemplate.convertAndSend("/topic/board/" + boardId, message);
    }
}
