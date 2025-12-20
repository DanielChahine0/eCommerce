package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * CORS Configuration for the application.
 * 
 * This is currently commented out but can be enabled when you need to connect
 * a frontend application from a different origin.
 * 
 * To enable: Remove the block comment markers and add this bean to
 * SecurityConfig
 * by calling http.cors() in the securityFilterChain method.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow requests from your frontend origin
        // Change this to your frontend URL in production
        configuration.setAllowedOrigins(Arrays.asList(
                //"http://localhost:3000", // React default
                //"http://localhost:4200", // Angular default
                //"http://localhost:5173", // Vite default
                "https://ecommerce-gedf.onrender.com"
        ));

        // Allow specific HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Allow specific headers
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin"));

        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        // How long the response from a pre-flight request can be cached
        configuration.setMaxAge(3600L);

        // Expose headers that the client can access
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
