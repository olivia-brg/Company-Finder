package com.company_finder.back.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.company_finder.back.models.Activity;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Query("SELECT a FROM Activity")
    public default List<Activity> findAllActivities() {
        return findAll();
    }

    @Query("SELECT a FROM Activity a WHERE a.name LIKE CONCAT('%', :name, '%')")
    public List<Activity> findNafCodeByActivityName(String name);

    @Query("SELECT a.name FROM Activity a WHERE a.naf_code LIKE :code ")
    public String findActivityNameWithNafCode(String code);
}
