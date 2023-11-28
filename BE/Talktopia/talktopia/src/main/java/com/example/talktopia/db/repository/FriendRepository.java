package com.example.talktopia.db.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.talktopia.db.entity.friend.Friend;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {

	List<Friend> findByUser_UserNo(long userNo);

	Friend findByUser_UserNoAndFrFriendNo(long userNo, long friendNo);

}
