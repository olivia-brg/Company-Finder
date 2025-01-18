package com.company_finder.back.services;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company_finder.back.DTOs.ActivityDTO;
import com.company_finder.back.DTOs.CategoryDTO;
import com.company_finder.back.DTOs.SubcategoryDTO;
import com.company_finder.back.repositories.NafListRepository;

@Service
public class NafListService {

    @Autowired
    private NafListRepository nafListRepository;

    public List<CategoryDTO> search(String keyword) {
        String formattedKeyword = "%" +keyword + "%";
        List<Object[]> rawResults = nafListRepository.searchGlobal(formattedKeyword);

        Map<Long, CategoryDTO> categoryMap = new LinkedHashMap<>();

        for (Object[] row : rawResults) {
            Long categoryId = row[0] != null ? ((Number) row[0]).longValue() : null;
            String categoryName = row[1] != null ? (String) row[1] : null;

            Long subcategoryId = row[2] != null ? ((Number) row[2]).longValue() : null;
            String subcategoryName = row[3] != null ? (String) row[3] : null;

            Long activityId = row[4] != null ? ((Number) row[4]).longValue() : null;
            String activityName = row[5] != null ? (String) row[5] : null;
            String nafCode = row[6] != null ? (String) row[6] : null;

            // Add category if not already in the map
            CategoryDTO category = categoryMap.computeIfAbsent(categoryId, id -> new CategoryDTO(id, nafCode));
            category.setId(categoryId);
            category.setName(categoryName);

            // Add subcategory if not already in the category
            if (subcategoryId != null) {
                SubcategoryDTO subcategory = category.getSubcategories().stream()
                        .filter(s -> s.getId().equals(subcategoryId))
                        .findFirst()
                        .orElseGet(() -> {
                            SubcategoryDTO newSubcategory = new SubcategoryDTO(activityId, nafCode);
                            newSubcategory.setId(subcategoryId);
                            newSubcategory.setName(subcategoryName);
                            category.getSubcategories().add(newSubcategory);
                            return newSubcategory;
                        });

                // Add activity to the subcategory
                if (activityId != null) {
                    ActivityDTO activity = new ActivityDTO(activityId, nafCode, nafCode);
                    activity.setId(activityId);
                    activity.setName(activityName);
                    activity.setNafCode(nafCode);
                    subcategory.getActivities().add(activity);
                }
            }
        }

        return new ArrayList<>(categoryMap.values());
    }
}
