package com.company_finder.demo;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/codeNaf")

public class CodeNafController {

    @GetMapping
    public CodeNafResponse getAllCodes() {
        return CompanyFinderApplication.getAllCodeAsObject();
    }
}
