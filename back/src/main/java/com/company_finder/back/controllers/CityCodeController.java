package com.company_finder.back.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import com.company_finder.back.DTOs.CityDTO;
// import com.company_finder.back.services.CityCodeService;

@RestController
@RequestMapping("/api/city_code")
public class CityCodeController {

    @Value("${external.api.url}")
    private String externalApiUrl;

    private RestTemplate restTemplate = new RestTemplate();


    @GetMapping
    public ResponseEntity<Object> proxySearch(@RequestParam("cityName") String cityName) {
        try {
            String encodedCityName = URLEncoder.encode(cityName, StandardCharsets.UTF_8);

            String dynamicUrl = String.format(
                    "%s?nom=%s&fields=departement&boost=population&limit=20",
                    externalApiUrl,
                    encodedCityName
            );

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json");
            HttpEntity<Object> requestEntity = new HttpEntity<>(null, headers);

            ResponseEntity<Object> response = restTemplate.exchange(
                    dynamicUrl,
                    HttpMethod.GET,
                    requestEntity,
                    Object.class
            );

            ObjectMapper objectMapper = new ObjectMapper();
            List<CityDTO> cities = objectMapper.convertValue(response.getBody(), new TypeReference<List<CityDTO>>() {
            });

            cities = cities.stream()
                    .map(city -> {
                            if ("Paris".equalsIgnoreCase(city.getNom())) {
                                city.setCode("75101,75102,75103,75104,75105,75106,75107,75108,75109,75110,75111,75112,75113,75114,75115,75116,75117,75118,75119,75120");
                                city.setNom("Paris (ville entière)");
                            } else if ("Lyon".equalsIgnoreCase(city.getNom())) {
                                city.setCode("69381,69382,69383,69384,69385,69386,69387,69388,69389");
                                city.setNom("Lyon (ville entière)");
                            } else if ("Marseille".equalsIgnoreCase(city.getNom())) {
                                city.setCode("13201,13202,13203,13204,13205,13206,13207,13208,13209,13210,13211,13212,13213,13214,13215,13216");
                                city.setNom("Marseille (ville entière)");
                            }
                        return city;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.status(response.getStatusCode()).body(cities);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Une erreur s'est produite lors de l'appel à l'API externe.");
        }
    }
}
