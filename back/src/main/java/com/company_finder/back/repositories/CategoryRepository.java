package com.company_finder.back.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.company_finder.back.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>{

    @Query("SELECT c FROM Category c ORDER BY c.id")
    public List<Category> findAllCategories();

}
