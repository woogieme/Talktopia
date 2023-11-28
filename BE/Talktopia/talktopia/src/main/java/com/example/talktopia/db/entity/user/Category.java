package com.example.talktopia.db.entity.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="category")
@Getter
@Setter
@NoArgsConstructor
public class Category {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="ca_id")
	private long categoryId;

	@ManyToOne
	@JoinColumn(name="reported_user_no")
	private ReportedUser reportedUser;

	@Column(name = "category_type")
	private String categoryType;

	@Builder
	public Category(long categoryId, ReportedUser reportedUser, String categoryType) {
		this.categoryId = categoryId;
		this.categoryType = categoryType;
		setReportStatus(reportedUser);
	}

	public void setReportStatus(ReportedUser reportedUser){
		this.reportedUser =reportedUser;
		if(this.reportedUser!=null){
			reportedUser.getCategoryList().add(this);
		}
	}
}
