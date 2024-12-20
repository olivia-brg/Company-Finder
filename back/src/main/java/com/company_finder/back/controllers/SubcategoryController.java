package com.company_finder.back.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.company_finder.back.models.Subcategory;
import com.company_finder.back.repositories.SubcategoryRepository;

@RestController
@RequestMapping("/api/subcategory")
public class SubcategoryController {

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @GetMapping("")
    public List<Subcategory> getAllSubategories() {
        return subcategoryRepository.findAllSubcategories();
    }

    @GetMapping("/name={subcategoryName}")
    public List<Subcategory> getSubcategoriesByName(@PathVariable String subcategoryName) {
        return subcategoryRepository.findSubcategoryByName(subcategoryName);
    }
}
