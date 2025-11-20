package com.example.demo.service;

import com.example.demo.controller.dto.SpamClassificationRequest;
import com.example.demo.controller.dto.SpamClassificationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SpamClassifierService {

    private final RestTemplate restTemplate;
    private final String aiServiceUrl;

    public SpamClassifierService(
            RestTemplate restTemplate,
            @Value("${ai.service.url}") String aiServiceUrl) {
        // La URL completa al endpoint de Python
        this.aiServiceUrl = aiServiceUrl + "/classify_spam";
        this.restTemplate = restTemplate;
    }


    public SpamClassificationResponse classifyMessage(String content) {

        SpamClassificationRequest request = new SpamClassificationRequest();
        request.message = content;

        try {
            return restTemplate.postForObject(
                    aiServiceUrl,
                    request,
                    SpamClassificationResponse.class
            );
        } catch (Exception e) {
            System.err.println("Error al comunicarse con el servicio de IA de Spam: " + e.getMessage());
            throw new RuntimeException("Error de comunicación con el clasificador de IA. ¿El servicio Python está corriendo en 5000?", e);
        }
    }
}