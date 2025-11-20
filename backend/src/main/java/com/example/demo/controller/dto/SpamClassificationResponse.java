package com.example.demo.controller.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SpamClassificationResponse {

    @JsonProperty("message")
    private String message;

    @JsonProperty("isSpam")
    private boolean isSpam;

    @JsonProperty("label")
    private String label;

    public SpamClassificationResponse() {}

    public SpamClassificationResponse(String message, boolean isSpam, String label) {
        this.message = message;
        this.isSpam = isSpam;
        this.label = label;
    }


    public String getMessage() {
        return message;
    }

    public boolean isSpam() {
        return isSpam;
    }

    public String getLabel() {
        return label;
    }


    public void setMessage(String message) {
        this.message = message;
    }

    public void setSpam(boolean isSpam) {
        this.isSpam = isSpam;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
