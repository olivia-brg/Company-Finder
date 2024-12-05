package com.company_finder.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/codeNAF")

public class CodeNafController {

    @GetMapping
    public CodeNafResponse getAllCodes() {
        return CompanyFinderApplication.getAllCodeAsObject();
    }
}
