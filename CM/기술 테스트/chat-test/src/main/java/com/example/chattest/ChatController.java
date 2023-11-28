package com.example.chattest;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatController  {

    /** 1:N 메세징용 (단순로직) */
    @MessageMapping("/chat")        // /chat으로 채팅을 보냄
    @SendTo("/topic/messages")      // /topic/message로 받은 메세지를 다시 보냄
    public ChatMessage sendMessage(@Payload ChatMessage message) { // @Payload로 JSON을 객체로 변환
        System.out.println("message: "+message.toString());
        return message; // 메세지 브로드캐스팅
    }

    /** 세션 이용 1:1 채팅 */
    private final SimpMessagingTemplate messagingTemplate; // 브로커 없이 유저에게 직접 전달

    public ChatController(SimpMessagingTemplate messagingTemplate){
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/session-chat")
    public void sendPrivateMessage(Principal principal, @Payload ChatMessage message){
        // 수신자에게 보냄
        messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/messages", message);
    }
}
