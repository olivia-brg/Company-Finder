package com.company_finder.back.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "activity")
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

    @Column(name = "subcat_id")
    private int subcat_id;

    @Column(name = "naf_code")
    private String naf_code;

    // @ManyToOne
    // @JoinColumn(name = "subcategory_id")
    // private Subcategory subcategory;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSubcat_id() {
        return subcat_id;
    }

    public void setSubcat_id(int subcat_id) {
        this.subcat_id = subcat_id;
    }

    public String getNaf_code() {
        return naf_code;
    }

    public void setNaf_code(String naf_code) {
        this.naf_code = naf_code;
    }

    // public Subcategory getSubcategory() {
    //     return subcategory;
    // }

    // public void setSubcategory(Subcategory subcategory) {
    //     this.subcategory = subcategory;
    // }

    // @ManyToOne
    // private Subcategory subcategory;
}
