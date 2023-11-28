package com.example.talktopia.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.talktopia.db.entity.user.Language;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {
	Language findByLangStt(String langStt);


	Language findByLangName(String language);
	// Language findByLangNo(Long langNo);
}
