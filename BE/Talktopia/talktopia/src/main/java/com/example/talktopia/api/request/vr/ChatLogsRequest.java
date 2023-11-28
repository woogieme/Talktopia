package com.example.talktopia.api.request.vr;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChatLogsRequest {

    private String vrSession;
    private List<SaveChatLog> conversationLog;
    private List<SaveChatLog> chatLog;

}
