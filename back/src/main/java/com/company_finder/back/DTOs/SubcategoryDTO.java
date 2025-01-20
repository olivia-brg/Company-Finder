package com.company_finder.back.DTOs;

import java.util.ArrayList;
import java.util.List;



public class SubcategoryDTO {
    private Long id;
    private String name;
    private List<ActivityDTO> activities = new ArrayList<>();

    public SubcategoryDTO(Long id, String name) {
        this.id = id;
        this.name = name;
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
    public List<ActivityDTO> getActivities() {
        return activities;
    }
    public void setActivities(List<ActivityDTO> activities) {
        this.activities = activities;
    }
}