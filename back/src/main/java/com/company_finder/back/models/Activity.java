package com.company_finder.back.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table (name = "activity")
public class Activity {
    public Long getId() {
        return id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {    
        this.name = name;
    }

    @Column(name = "subcat_id")
    private int subcat_id;

    public int getSubcat_id() {
        return subcat_id;
    }

    public void setSubcat_id(int subcat_id) {
        this.subcat_id = subcat_id;
    }

    @Column(name = "naf_code")
    private String naf_code;

    public String getNaf_code() {
        return naf_code;
    }

    public void setNaf_code(String naf_code) {
        this.naf_code = naf_code;
    }
}
