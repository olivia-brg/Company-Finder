package com.company_finder.demo;

import java.util.List;
import java.util.Map;

public class CodeNafResponse {
    private Map<String, Map<String, List<Activity>>> categories;

    public void setCategories(Map<String, Map<String, List<Activity>>> categories) {
        this.categories = categories;
    }

    public Map<String, Map<String, List<Activity>>> getCategories() {
        return categories;
    }
    
}