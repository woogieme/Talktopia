package com.example.chattest;

/** 채팅 메세지를 담은 기본적인 class */
public class ChatMessage {
    public String sender;
    public String content;

    @Override
    public String toString() {
        return "ChatMessage{" +
                "sender='" + sender + '\'' +
                ", content='" + content + '\'' +
                '}';
    }

    public String getSender() {
        return sender;
    }

    public String getContent() {
        return content;
    }

    public ChatMessage() {
    }

    public ChatMessage(String sender, String content) {
        this.sender = sender;
        this.content = content;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setContent(String content) {
        this.content = content;
    }

    // Getters and setters (you can generate these using your IDE)
}
