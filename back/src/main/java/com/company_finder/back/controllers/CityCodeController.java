package com.company_finder.back.controllers;

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
// import com.company_finder.back.services.CityCodeService;

@RestController
@RequestMapping("/api/city_code")
public class CityCodeController {

    @Value("${external.api.url}")
    private String externalApiUrl;
    private RestTemplate restTemplate;

    public CityCodeController() {
        this.restTemplate = new RestTemplate();
    }

    @GetMapping
    public ResponseEntity<Object> proxySearch(@RequestParam("cityName") String cityName) {
        String dynamicUrl = String.format(
            "%s?nom=%s&fields=departement&boost=population&limit=20",
            externalApiUrl,
            cityName
        );

        // Créer les headers de la requête
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");

        // Préparer la requête
        HttpEntity<Object> requestEntity = new HttpEntity<>(null, headers);

        // Faire la requête GET à l'API externe
        ResponseEntity<Object> response = restTemplate.exchange(
                dynamicUrl,
                HttpMethod.GET,
                requestEntity,
                Object.class
        );

        // Retourner la réponse de l'API externe au client
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }
}
