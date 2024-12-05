package com.company_finder.demo;

import java.io.FileNotFoundException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication(exclude = {org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class})

public class CompanyFinderApplication {

    public static void main(String[] args) {
        SpringApplication.run(CompanyFinderApplication.class, args);
    }

    @SuppressWarnings("unused")
    public static CodeNafResponse getAllCodeAsObject() {
    try (Reader reader = new InputStreamReader(
            CompanyFinderApplication.class.getClassLoader().getResourceAsStream("assets/CodeNAF.json"))) {
        if (reader == null) {
            throw new FileNotFoundException("File 'assets/CodeNAF.json' not found in resources.");
        }

        JSONParser parser = new JSONParser();
        JSONObject rootObject = (JSONObject) parser.parse(reader);

        Map<String, Map<String, List<Activity>>> categories = new HashMap<>();

        for (Object key : rootObject.keySet()) {
            String category = (String) key;
            JSONObject subCategory = (JSONObject) rootObject.get(key);

            Map<String, List<Activity>> subCategoryMap = new HashMap<>();

            for (Object subKey : subCategory.keySet()) {
                String subCategoryName = (String) subKey;
                JSONArray activitiesArray = (JSONArray) subCategory.get(subKey);

                List<Activity> activities = new ArrayList<>();
                for (Object activityObj : activitiesArray) {
                    JSONObject activity = (JSONObject) activityObj;
                    Activity newActivity = new Activity();
                    newActivity.setId(((Long) activity.get("id")).intValue());
                    newActivity.setActivity((String) activity.get("activity"));
                    newActivity.setNaf((String) activity.get("naf"));
                    activities.add(newActivity);
                }
                subCategoryMap.put(subCategoryName, activities);
            }
            categories.put(category, subCategoryMap);
        }

        CodeNafResponse response = new CodeNafResponse();
        response.setCategories(categories);
        return response;
    } catch (Exception e) {
        throw new RuntimeException("Error reading CodeNAF data", e);
    }
}
}
