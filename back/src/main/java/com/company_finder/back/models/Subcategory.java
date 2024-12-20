package com.company_finder.back.models;

import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "subcategory")
public class Subcategory {

    public Long getId() {
        return id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "category_id")
    private int category_id;
    
    // @OneToMany(mappedBy = "subcategory")
    // private List<Activity> activities;
    
    // @ManyToOne
    // @JoinColumn(name = "category_id")
    // private Category category;

    // public List<Activity> getActivities() {
    //     return activities;
    // }

    // public void setActivities(List<Activity> activities) {
    //     this.activities = activities;
    // }

    // public Category getCategory() {
    //     return category;
    // }

    // public void setCategory(Category category) {
    //     this.category = category;
    // }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCategory_id() {
        return category_id;
    }

    public void setCategory_id(int category_id) {
        this.category_id = category_id;
    }
}
