package com.company_finder.back.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.company_finder.back.models.Category;
import com.company_finder.back.models.Subcategory;

public interface CategoryRepository extends JpaRepository<Category, Long>{

    @Query("SELECT c FROM Category c ORDER BY c.id")
    public List<Category> findAllCategories();

    @Query("SELECT c FROM Category c WHERE c.name LIKE CONCAT('%', :name, '%')")
    List<Subcategory> findCategoryByName(@Param("name") String name);

}
