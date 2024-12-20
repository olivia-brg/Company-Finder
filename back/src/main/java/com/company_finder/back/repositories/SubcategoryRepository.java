package com.company_finder.back.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.company_finder.back.models.Subcategory;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {

    @Query("SELECT s FROM Subcategory s JOIN s.activities a WHERE a.subcatId = s.id")
    public default List<Subcategory> findAllCategories() {
        return findAll();
    }

    // @Query("SELECT s FROM Subcategory s JOIN s.activities a WHERE a.subcat_id = :id")
    // List<Subcategory> findAllCategoriesBySubcatId(@Param("id") Long id);

}
