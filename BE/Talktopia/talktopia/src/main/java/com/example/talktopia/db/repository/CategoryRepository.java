package com.example.talktopia.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.talktopia.db.entity.user.Category;

import lombok.extern.java.Log;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}
