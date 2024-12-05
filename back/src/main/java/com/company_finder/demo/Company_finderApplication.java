package com.company_finder.demo;

import java.io.FileNotFoundException;
import java.io.InputStreamReader;
import java.io.Reader;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class})
public class Company_finderApplication {

    public static String getAllCode() {
        try (Reader reader = new InputStreamReader(
                Company_finderApplication.class.getClassLoader().getResourceAsStream("assets/CodeNAF.json"))) {
            if (reader == null) {
                throw new FileNotFoundException("File 'assets/CodeNAF.json' not found in resources.");
            }
            // Parse the JSON file
            Object parsedObject = new JSONParser().parse(reader);
            JSONObject rootObject = (JSONObject) parsedObject;

            // Iterate over the main keys (e.g., "Agiculture, sylviculture et pêche")
            StringBuilder responseBuilder = new StringBuilder();
            for (Object key : rootObject.keySet()) {
                responseBuilder.append("Category: ").append(key).append("\n");
                JSONObject subCategory = (JSONObject) rootObject.get(key);

                // Iterate over subcategories (e.g., "Culture et production animale, chasse et services annexes")
                for (Object subKey : subCategory.keySet()) {
                    responseBuilder.append("  Subcategory: ").append(subKey).append("\n");
                    JSONArray activities = (JSONArray) subCategory.get(subKey);

                    // Iterate over the activities array
                    for (Object activityObj : activities) {
                        JSONObject activity = (JSONObject) activityObj;
                        responseBuilder.append("    - Activity: ").append(activity.get("activity"))
                                .append(", NAF: ").append(activity.get("naf")).append("\n");
                    }
                }
            }

            return responseBuilder.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error reading CodeNAF data", e);
        }
    }
}