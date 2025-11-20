package com.example.demo.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "usuario",
        uniqueConstraints = @UniqueConstraint(name = "uk_user_email", columnNames = "correo")
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "nombre", nullable = false, length = 50)   // <-- map a 'nombre'
    private String firstName;

    @Column(name = "apellido", nullable = false, length = 50) // <-- map a 'apellido'
    private String lastName;

    @Column(name = "correo", nullable = false, length = 100)
    private String email;

    @Column(name = "contrasena", nullable = false, length = 255)
    private String password;

    @Column(
            name = "fecha_creacion",
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
            insertable = false, updatable = false
    )
    private java.time.LocalDateTime createdAt;

    @Column(name = "enable", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean enabled = true;
    public User() {}

    public User(String firstName, String lastName, String email, String password) {
        this.firstName  = firstName;
        this.lastName   = lastName;
        this.email      = email;
        this.password   = password;
    }

    // Getters & setters
    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String v) { this.firstName = v; }

    public String getLastName() { return lastName; }
    public void setLastName(String v) { this.lastName = v; }

    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }

    public String getPassword() { return password; }
    public void setPassword(String v) { this.password = v; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}
