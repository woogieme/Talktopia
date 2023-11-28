package com.example.talktopia.common.util;

import javax.annotation.PreDestroy;

import org.springframework.stereotype.Component;

import com.example.talktopia.db.repository.ParticipantsRepository;
import com.example.talktopia.db.repository.VRoomRepository;

@Component
public class DatabaseCleanupOnShutdown {

    private final ParticipantsRepository participantsRepository; // 해당 테이블의 레포지토리

    private final VRoomRepository vRoomRepository;

    public DatabaseCleanupOnShutdown( ParticipantsRepository participantsRepository
    ,VRoomRepository vRoomRepository) {
        this.participantsRepository = participantsRepository;
        this.vRoomRepository=vRoomRepository;
    }

    @PreDestroy
    public void cleanup() {
        // 서버 종료 시 해당 테이블 비우는 로직
        participantsRepository.deleteAll(); // 예시로 모든 데이터 삭제
        vRoomRepository.deleteAll();
    }
}