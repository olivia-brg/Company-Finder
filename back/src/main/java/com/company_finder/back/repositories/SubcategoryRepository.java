package com.company_finder.back.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.company_finder.back.models.Subcategory;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {

    @Query("SELECT s FROM Subcategory s")
    public default List<Subcategory> findAllSubcategories() {
        return findAll();
    }

    @Query("SELECT s FROM Subcategory s WHERE s.name LIKE CONCAT('%', :name, '%')")
    List<Subcategory> findSubcategoryByName(@Param("name") String name);

}
