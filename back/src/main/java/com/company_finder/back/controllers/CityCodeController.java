package com.company_finder.back.controllers;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.company_finder.back.DTOs.CityDTO;
import com.company_finder.back.DTOs.departementDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/city_code")
public class CityCodeController {

    @Value("${external.api.url}")
    private String externalApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

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
                    .flatMap(city -> {
                        if ("Paris".equalsIgnoreCase(city.getNom())) {
                            return Stream.concat(
                                    Stream.of(createCityEntire(city, "75101,75102,75103,75104,75105,75106,75107,75108,75109,75110,75111,75112,75113,75114,75115,75116,75117,75118,75119,75120")),
                                    generateArrondissementResults(
                                            city,
                                            new String[]{
                                                    "75101", "75102", "75103", "75104", "75105", "75106", "75107", "75108",
                                                    "75109", "75110", "75111", "75112", "75113", "75114", "75115", "75116",
                                                    "75117", "75118", "75119", "75120"
                                            }
                                    ).stream()
                            );
                        } else if ("Lyon".equalsIgnoreCase(city.getNom())) {
                            return Stream.concat(
                                    Stream.of(createCityEntire(city, "69381,69382,69383,69384,69385,69386,69387,69388,69389")),
                                    generateArrondissementResults(
                                        city,
                                            new String[]{
                                                    "69381", "69382", "69383", "69384", "69385", "69386", "69387", "69388", "69389"
                                            }
                                    ).stream()
                            );
                        } else if ("Marseille".equalsIgnoreCase(city.getNom())) {
                            return Stream.concat(
                                    Stream.of(createCityEntire(city, "13201,13202,13203,13204,13205,13206,13207,13208,13209,13210,13211,13212,13213,13214,13215,13216")),
                                    generateArrondissementResults(
                                        city,
                                            new String[]{
                                                    "13201", "13202", "13203", "13204", "13205", "13206", "13207", "13208",
                                                    "13209", "13210", "13211", "13212", "13213", "13214", "13215", "13216"
                                            }
                                    ).stream()
                            );
                        } else {
                            return Stream.of(city);
                        }
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.status(response.getStatusCode()).body(cities);

        } catch (IllegalArgumentException | RestClientException e) {
            return ResponseEntity.status(500).body("Une erreur s'est produite lors de l'appel à l'API externe.");
        }
    }

    private List<CityDTO> generateArrondissementResults(CityDTO city, String[] arrondissementCodes) {
        return Arrays.stream(arrondissementCodes)
                .map(code -> {String ordinal;
                    CityDTO arrondissement = new CityDTO();
                    if ("01".equals(code.substring(3))) ordinal = "er";
                    else ordinal = "e";
                    arrondissement.setNom(city.getNom() + " " + code.substring(3) + ordinal + " arrondissement ");
                    arrondissement.setCode(code);
                    arrondissement.set_score(0);
                    departementDTO departement = new departementDTO();
                    departement.setCode(city.getDepartement().getCode());
                    departement.setNom(city.getDepartement().getNom());
                    arrondissement.setDepartement(departement);
                    return arrondissement;
                })
                .collect(Collectors.toList());
    }

    private CityDTO createCityEntire(CityDTO city, String allCodes) {
        CityDTO cityEntire = new CityDTO();
        cityEntire.setNom(city.getNom() + " (ville entière)");
        cityEntire.setCode(allCodes);
        cityEntire.set_score(city.get_score());
        cityEntire.setDepartement(city.getDepartement());
        return cityEntire;
    }
}
