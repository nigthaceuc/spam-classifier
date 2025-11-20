package com.example.demo.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.*;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.auth.mail.from:no-reply@example.com}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String to, int code, int expMinutes) {
        try {
            var msg = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(msg, true, "UTF-8"); // multipart enabled

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject("Your OTP code");

            String plain = "Your OTP is: " + code + "\nThis code expires in " + expMinutes + " minutes.";
            String html  = """
                <p>Your OTP is: <b>%d</b></p>
                <p>This code expires in <b>%d minutes</b>.</p>
                """.formatted(code, expMinutes);

            helper.setText(plain, html); // dual plain+HTML because multipart=true
            mailSender.send(msg);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to send OTP email", e);
        }
    }
}
