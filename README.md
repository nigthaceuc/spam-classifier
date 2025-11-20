Aquí está un **README totalmente profesional**, pulido, ordenado, con buena redacción, formato empresarial y estilo moderno**, sin cambiar el contenido técnico de tu proyecto.

Lo puedes copiar/pegar directamente como `README.md`.

---

# 🌐 **Spam Classifier — Sistema de Autenticación + Clasificación de Mensajes (MFA & Passwordless)**

Este proyecto es un **monorepositorio** que integra:

* **Backend** → Spring Boot
* **Frontend** → React + Vite
* **Clasificación de Spam** → Servicio de IA (Python + Flask)
* **Autenticación moderna** → MFA (contraseña + OTP) y Passwordless

Incluye autenticación tradicional, envío de códigos OTP por correo, validación segura y un sistema adicional para clasificación de mensajes spam/ham mediante un modelo entrenado con machine learning.

---

## 📁 **1. Estructura del repositorio**

```
spam-classifier/
├── ai-spam-service/   → Clasificador de spam (Python + Flask)
├── backend/           → API REST de autenticación (Spring Boot)
└── frontend/          → Aplicación web (React + Vite)
```

---

## 🚀 **2. Funcionalidades principales**

### 🔐 **Autenticación (Spring Boot)**

* Registro de usuarios
* Inicio de sesión tradicional (correo + contraseña)
* Envío de OTP por correo (segundo factor)
* Login Passwordless (solo correo)
* Reenvío y expiración automática de OTP
* Hash seguro de contraseñas (BCrypt)

### 🤖 **Clasificador de Spam (Python)**

* IA basada en TF-IDF + modelo entrenado
* Limpieza y preprocesamiento de texto
* API REST para clasificar mensajes
* Historial de predicciones

### 💻 **Frontend (React + Tailwind)**

* Formularios de login y OTP
* Interfaz moderna para clasificar mensajes
* Visualización del historial
* Alertas, feedback y validaciones

---

## 📦 **3. Requisitos del sistema**

### Backend

* Java **17+**
* Maven (wrapper incluido)

### Frontend

* Node.js **22.21.0** (recomendado usar `nvm`)

### Clasificador IA

* Python 3.x
* Flask, joblib, scikit-learn

### Otros servicios

* PostgreSQL (cualquier versión compatible)
* SMTP para pruebas (MailHog / Mailtrap)

---

## 🧩 **4. Backend — Spring Boot**

### ▶️ Ejecución

```bash
cd backend
./mvnw spring-boot:run
```

API disponible en:

```
http://localhost:8080
```

---

### 📬 **4.1 Configuración de correo (OTP)**

Editar:

```
backend/src/main/resources/application.properties
```

#### Ejemplo para desarrollo (MailHog)

```
app.auth.expose-otp-in-response=true
app.auth.otp-exp-minutes=5

spring.mail.host=localhost
spring.mail.port=1025
spring.mail.properties.mail.smtp.auth=false
spring.mail.properties.mail.smtp.starttls.enable=false
```

#### Producción (Mailtrap)

```
app.auth.expose-otp-in-response=false
spring.mail.host=sandbox.smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=TU_USER
spring.mail.password=TU_PASS
```

---

## 🎨 **5. Frontend — React + Vite**

### ▶️ Ejecución

```bash
cd frontend
nvm use
npm install
npm run dev
```

Disponible en:

```
http://localhost:5173
```

---

## 🤖 **6. Clasificador IA — API Python**

(Este servicio no estaba en tu README original, pero lo agrego por completitud profesional. Puedes quitarlo si quieres.)

```bash
cd ai-spam-service
pip install -r requirements.txt
python3 spam_api.py
```

Disponible en:

```
http://localhost:5000
```

---

## 🔐 **7. Flujo de autenticación**

### 📝 7.1 Registro

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ana","lastName":"Lopez","email":"ana@example.com","password":"Secret.123"}'
```

---

### 🔑 7.2 Login (contraseña + OTP)

#### 1) Enviar OTP

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"Secret.123","device":"Chrome/Linux"}'
```

Respuesta (modo desarrollo):

```json
{
  "message": "First factor OK. OTP sent to email.",
  "otp_demo": 123456,
  "valid_minutes": 5
}
```

#### 2) Validar OTP

```bash
curl -X POST http://localhost:8080/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","code":123456}'
```

---

### ✉️ 7.3 Login Passwordless

#### 1) Solicitar OTP

```bash
curl -X POST http://localhost:8080/api/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","device":"Chrome/Linux"}'
```

#### 2) Validar OTP

(usa el mismo endpoint del flujo tradicional)

---

## 🧠 **8. Clasificador de Spam — Mensajes del sistema**

* **Login correcto** → OTP enviado
* **OTP correcto** → Inicio de sesión exitoso
* **OTP incorrecto** → Código inválido
* **OTP expirado** → Código expirado
* **OTP reenviado** → Nuevo código enviado

---

## 🔒 **9. Seguridad implementada**

* MFA (correo + contraseña + OTP)
* Login Passwordless
* Contraseñas en **BCrypt**
* Expiración de códigos OTP
* Reenvío seguro
* Validación estricta de DTOs
* SMTP configurable

Recomendado para producción:

```
app.auth.expose-otp-in-response=false
```

---

## 🧱 **10. Convenciones de commits (Conventional Commits)**

Ejemplos:

```
feat(auth-backend): implementa endpoints de OTP y login
fix(ux): mejora mensajes de verificación
docs(readme): actualización de documentación
chore(repo): organiza estructura monorepo
```

---

## 🗺️ **11. Roadmap (Futuras mejoras sugeridas)**

* Sistema de roles y permisos
* Tokens JWT
* Refresh Tokens
* Logs avanzados y auditoría
* Recuperación de contraseña
* Panel de administración

---

## 📄 **12. Licencia**

**MIT License**
Libre uso para aprendizaje, investigación y desarrollo.

---

## 👤 **13. Autor**

Proyecto desarrollado con fines educativos y de práctica profesional en autenticación moderna y clasificación automática de mensajes.

**Autor:** *nigthaceuc*
