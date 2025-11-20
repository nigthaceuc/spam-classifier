package com.example.demo.controller;

import com.example.demo.controller.dto.*;
import com.example.demo.models.User;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final OtpService otpService;
    private final AuthenticationManager authManager;
    private final EmailService emailService;

    @Value("${app.auth.expose-otp-in-response:false}")
    private boolean exposeOtpInResponse;

    @Value("${app.auth.otp-exp-minutes:5}")
    private int otpExpMinutes;

    public AuthController(UserService userService,
                          OtpService otpService,
                          AuthenticationManager authManager,
                          EmailService emailService) {
        this.userService = userService;
        this.otpService = otpService;
        this.authManager = authManager;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        User u = userService.register(req.firstName, req.lastName, req.email, req.password);
        return ResponseEntity.ok(Map.of("message", "User registered", "id", u.getId()));
    }

    /** Step 1: email+password; Step 2: send OTP to email */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Authentication auth = new UsernamePasswordAuthenticationToken(req.email, req.password);
        authManager.authenticate(auth); // throws if invalid

        User u = userService.getByEmailOrThrow(req.email);
        var otp = otpService.generate(u, req.device, otpExpMinutes);

        // Send OTP via email
        emailService.sendOtpEmail(u.getEmail(), otp.getCode(), otpExpMinutes);

        if (exposeOtpInResponse) {
            return ResponseEntity.ok(Map.of(
                    "message", "First factor OK. OTP sent to email.",
                    "otp_demo", otp.getCode(),
                    "valid_minutes", otpExpMinutes
            ));
        }
        return ResponseEntity.ok(Map.of(
                "message", "First factor OK. OTP sent to email.",
                "valid_minutes", otpExpMinutes
        ));
    }
    @PostMapping("/otp/request")
    public ResponseEntity<?> requestOtp(@RequestBody OtpRequest req) {
        return userService.findEnabledByEmail(req.email)
                .map(u -> {
                    var otp = otpService.generate(u, req.device, otpExpMinutes);
                    emailService.sendOtpEmail(u.getEmail(), otp.getCode(), otpExpMinutes);

                    if (exposeOtpInResponse) {
                        return ResponseEntity.ok(Map.of(
                                "message", "OTP sent to email.",
                                "otp_demo", otp.getCode(),
                                "valid_minutes", otpExpMinutes
                        ));
                    }
                    return ResponseEntity.ok(Map.of(
                            "message", "OTP sent to email.",
                            "valid_minutes", otpExpMinutes
                    ));
                })
                // Si quieres evitar enumeración de usuarios, devuelve 200 también aquí.
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Email not found")));
    }

    /** Step 3: verify OTP */
    @PostMapping("/otp/verify")
    public ResponseEntity<?> verify(@RequestBody OtpVerifyRequest req) {
        User u = userService.getByEmailOrThrow(req.email);
        boolean ok = otpService.verify(u, req.code);

        if (!ok) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired OTP"));
        }

        // Here you would normally issue a JWT and return it
        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "message", "MFA completed"
        ));
    }
}
