package com.example.talktopia.db.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.talktopia.db.entity.vr.Participants;

@Repository
public interface ParticipantsRepository extends JpaRepository<Participants, Long> {

	boolean existsByUser_UserNo(long userNo);

	void deleteByUser_UserNo(long userNo);

	Optional<Participants> findByUser_UserId(String userId);

	@Query("SELECT p FROM Participants p WHERE p.vRoom.vrSession = :vrSession")
	List<Participants> findByVRoom_VrSession(@Param("vrSession")String vrSession);

}
