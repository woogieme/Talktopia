package com.example.chattest;

import java.security.Principal;

/** 웹 통신의 주체에 대한 정보가 담겨있는 Principal 객체를 사용하여
특정 사용자에게 보낼 때 고유한 세션 이름을 생성함 */
public class StompPrincipal implements Principal {
   private String name;

   StompPrincipal(String name) {
       this.name = name;
   }

    @Override
    public String getName() {
        return name;
    }
}
