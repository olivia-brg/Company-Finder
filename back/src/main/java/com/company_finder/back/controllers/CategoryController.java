package com.company_finder.back.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.company_finder.back.models.Category;
import com.company_finder.back.models.Subcategory;
import com.company_finder.back.repositories.CategoryRepository;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("")
    public List<Category> getAllCategories() {
        return categoryRepository.findAllCategories();
    }

    @GetMapping("/name={categoryName}")
    public List<Subcategory> getSubcategoriesByName(@PathVariable String subcategoryName) {
        return categoryRepository.findCategoryByName(subcategoryName);
    }

}
