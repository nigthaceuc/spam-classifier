package com.example.demo.service;

import com.example.demo.models.OtpCode;
import com.example.demo.models.User;
import com.example.demo.repository.OtpCodeRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private final OtpCodeRepository repository;
    private final SecureRandom random = new SecureRandom();

    public OtpService(OtpCodeRepository repository) {
        this.repository = repository;
    }

    public OtpCode generate(User user, String device, int minutesValid) {
        int code = 100000 + random.nextInt(900000);
        LocalDateTime exp = LocalDateTime.now().plusMinutes(minutesValid);
        OtpCode otp = new OtpCode(code, exp, device, user);
        return repository.save(otp);
    }

    public boolean verify(User user, int code) {
        var now = LocalDateTime.now();
        return repository.findFirstByUserAndCodeAndUsedFalseAndExpiresAtAfter(user, code, now)
                .map(otp -> {
                    otp.setUsed(true);
                    repository.save(otp);
                    return true;
                })
                .orElse(false);
    }
}
