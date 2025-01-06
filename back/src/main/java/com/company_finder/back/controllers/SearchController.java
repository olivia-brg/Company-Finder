package com.company_finder.back.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.company_finder.back.DTOs.CategoryDTO;
import com.company_finder.back.services.SearchService;


@RestController
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/search")
    public List<CategoryDTO> search(@RequestParam String keyword) {
        return searchService.search(keyword);
    }
}