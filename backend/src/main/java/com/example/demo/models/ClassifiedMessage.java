package com.example.demo.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes_clasificados")
public class ClassifiedMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private User user;

    @Column(name = "contenido", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "es_spam", nullable = false)
    private Boolean isSpam;

    @Column(name = "clasificacion_etiqueta", length = 10, nullable = false)
    private String label; // "spam" o "ham"

    @Column(name = "fecha_clasificacion", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", insertable = false, updatable = false)
    private LocalDateTime classifiedAt;

    public ClassifiedMessage() {}

    public ClassifiedMessage(User user, String content, Boolean isSpam, String label) {
        this.user = user;
        this.content = content;
        this.isSpam = isSpam;
        this.label = label;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getContent() {
        return content;
    }

    public Boolean getIsSpam() {
        return isSpam;
    }

    public String getLabel() {
        return label;
    }

    public LocalDateTime getClassifiedAt() {
        return classifiedAt;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setIsSpam(Boolean isSpam) {
        this.isSpam = isSpam;
    }

    public void setLabel(String label) {
        this.label = label;
    }

}