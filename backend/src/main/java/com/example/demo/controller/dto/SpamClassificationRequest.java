package com.example.demo.controller.dto;




public class SpamClassificationRequest {
    public  String message;

    public String getMessage() {
        return message;
    }

    public SpamClassificationRequest() {

    }

    public void setMessage(String message) {
        this.message = message;
    }
}