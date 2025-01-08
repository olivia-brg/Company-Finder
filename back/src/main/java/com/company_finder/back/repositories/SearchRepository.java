package com.company_finder.back.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.company_finder.back.models.Category;

@Repository
public interface SearchRepository extends JpaRepository<Category, Long> {

    @Query(value = """
    WITH FilteredResults AS (
        -- Recherche dans la table category
        SELECT DISTINCT
            c.id AS category_id,
            c.name AS category_name,
            s.id AS subcategory_id,
            s.name AS subcategory_name,
            a.id AS activity_id,
            a.name AS activity_name,
            a.naf_code AS naf_code
        FROM category c
        LEFT JOIN subcategory s ON s.category_id = c.id
        LEFT JOIN activity a ON a.subcat_id = s.id
        WHERE c.name LIKE :keyword

        UNION ALL

        -- Recherche dans la table subcategory
        SELECT DISTINCT
            c.id AS category_id,
            c.name AS category_name,
            s.id AS subcategory_id,
            s.name AS subcategory_name,
            a.id AS activity_id,
            a.name AS activity_name,
            a.naf_code AS naf_code
        FROM subcategory s
        JOIN category c ON s.category_id = c.id
        LEFT JOIN activity a ON a.subcat_id = s.id
        WHERE s.name LIKE :keyword

        UNION ALL

        -- Recherche dans la table activity
        SELECT DISTINCT
            c.id AS category_id,
            c.name AS category_name,
            s.id AS subcategory_id,
            s.name AS subcategory_name,
            a.id AS activity_id,
            a.name AS activity_name,
            a.naf_code AS naf_code
        FROM activity a
        JOIN subcategory s ON a.subcat_id = s.id
        JOIN category c ON s.category_id = c.id
        WHERE a.name LIKE :keyword
        OR a.naf_code LIKE :keyword
    )
    SELECT DISTINCT
        category_id,
        category_name,
        subcategory_id,
        subcategory_name,
        activity_id,
        activity_name,
        naf_code
    FROM FilteredResults
    ORDER BY category_id, subcategory_id, activity_id
    """, nativeQuery = true)
    List<Object[]> searchGlobal(@Param("keyword") String keyword);
}
