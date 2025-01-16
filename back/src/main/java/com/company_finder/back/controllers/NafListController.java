package com.company_finder.back.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company_finder.back.DTOs.CategoryDTO;
import com.company_finder.back.services.NafListService;


@RestController
@RequestMapping("/api/naf_list")
public class NafListController {

    @Autowired
    private NafListService nafListService;

    @GetMapping("/search")
    public List<CategoryDTO> search(@RequestParam String keyword) {
        return nafListService.search(keyword);
    }
}