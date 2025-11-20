package com.example.demo.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "codigootp")
public class OtpCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_otp")
    private Long id;

    @Column(name = "codigo", nullable = false)          // <-- map a 'codigo'
    private Integer code;

    @Column(name = "fecha_creacion",
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
            insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "fecha_expiracion", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "usado", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean used = false;

    @Column(name = "dispositivo", length = 100)         // <-- map a 'dispositivo'
    private String device;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false,
            foreignKey = @ForeignKey(name = "fk_usuario")) // coincide con la FK real
    private User user;

    public OtpCode() {}
    public OtpCode(Integer code, LocalDateTime expiresAt, String device, User user) {
        this.code = code;
        this.expiresAt = expiresAt;
        this.device = device;
        this.user = user;
    }

    public Long getId() { return id; }
    public Integer getCode() { return code; }
    public void setCode(Integer v) { this.code = v; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime v) { this.expiresAt = v; }

    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }

    public String getDevice() { return device; }
    public void setDevice(String v) { this.device = v; }

    public User getUser() { return user; }
    public void setUser(User v) { this.user = v; }
}
