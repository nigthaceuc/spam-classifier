package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuración para exponer el RestTemplate necesario para hacer llamadas HTTP
 * al servicio de IA de Python.
 */
@Configuration
public class AiServiceConfiguration {

    // Este método crea y registra RestTemplate como un 'bean'
    // para que pueda ser inyectado automáticamente (autowired)
    // en SpamClassifierService.
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}