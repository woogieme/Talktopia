package com.example.talktopia.db.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.talktopia.api.response.user.ReportedUserRes;
import com.example.talktopia.db.entity.user.ReportedUser;

@Repository
public interface ReportedUserRepository extends JpaRepository<ReportedUser, Long> {
	ReportedUser findByUser_UserNo(long userNo);

	@Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM ReportedUser r WHERE r.ruVrSession = :vrSession AND r.ruBully = :bully AND r.ruReporter = :reporter")
	boolean existsByRuVrSessionAndRuBullyAndRuReporter(String vrSession, String bully, String reporter);

	@Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM ReportedUser r WHERE r.ruVrSession = :vrSession AND r.ruBully = :bully")
	boolean existsByRuVrSessionAndRuBully(String vrSession, String bully);

	ReportedUser findByRuVrSessionAndRuBully(String vrSession, String bully);

	List<ReportedUser> findAll();
}
