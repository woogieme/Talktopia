package com.example.talktopia.db.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.talktopia.db.entity.vr.SaveVRoomChatLog;

@Repository
public interface SaveVRoomChatLogRepository extends JpaRepository<SaveVRoomChatLog, Long> {

	List<SaveVRoomChatLog> findAll();
}
