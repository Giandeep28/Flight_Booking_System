package com.skyvoyage.config;

import com.mongodb.client.MongoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {
    
    @Value("${spring.data.mongodb.database}")
    private String databaseName;
    
    @Value("${spring.data.mongodb.host}")
    private String host;
    
    @Value("${spring.data.mongodb.port}")
    private int port;
    
    @Bean
    public MongoClient mongoClient() {
        return new MongoClient(host, port);
    }
    
    @Override
    protected String getDatabaseName() {
        return databaseName;
    }
}
