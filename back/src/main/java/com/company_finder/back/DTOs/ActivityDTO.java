package com.company_finder.back.DTOs;

public class ActivityDTO {
    private Long id;
    private String name;
    private String nafCode;

    public ActivityDTO(Long id, String name, String nafCode) {
        this.id = id;
        this.name = name;
        this.nafCode = nafCode;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getNafCode() {
        return nafCode;
    }
    public void setNafCode(String nafCode) {
        this.nafCode = nafCode;
    }
}