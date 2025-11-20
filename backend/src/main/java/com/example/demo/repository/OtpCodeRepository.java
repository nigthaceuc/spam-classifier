package com.example.demo.repository;

import com.example.demo.models.OtpCode;
import com.example.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {

    Optional<OtpCode> findTopByUserAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            User user, LocalDateTime now);

    Optional<OtpCode> findFirstByUserAndCodeAndUsedFalseAndExpiresAtAfter(
            User user, Integer code, LocalDateTime now);
}
