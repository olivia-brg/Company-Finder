package com.company_finder.back.models;

public class SearchResultDTO {

    private Long categoryId;
    private String categoryName;
    private Long subcategoryId;
    private String subcategoryName;
    private Long activityId;
    private String activityName;
    private String nafCode;

    // Constructeur
    public SearchResultDTO(Long categoryId, String categoryName, Long subcategoryId, String subcategoryName,
                            Long activityId, String activityName, String nafCode) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.subcategoryId = subcategoryId;
        this.subcategoryName = subcategoryName;
        this.activityId = activityId;
        this.activityName = activityName;
        this.nafCode = nafCode;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getSubcategoryId() {
        return subcategoryId;
    }

    public void setSubcategoryId(Long subcategoryId) {
        this.subcategoryId = subcategoryId;
    }

    public String getSubcategoryName() {
        return subcategoryName;
    }

    public void setSubcategoryName(String subcategoryName) {
        this.subcategoryName = subcategoryName;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getNafCode() {
        return nafCode;
    }

    public void setNafCode(String nafCode) {
        this.nafCode = nafCode;
    }

}
