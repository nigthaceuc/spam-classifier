# Mi App Auth
Autenticación MFA (contraseña + OTP) y passwordless

Este proyecto es un monorepositorio que implementa un sistema moderno de autenticación utilizando Spring Boot (backend) y React + Vite (frontend).
Permite autenticación tradicional mediante correo y contraseña usando OTP como segundo factor (MFA), así como inicio de sesión sin contraseña (passwordless) utilizando solamente el correo electrónico.

----------------------------------------------------------------
1. ESTRUCTURA DEL REPOSITORIO
----------------------------------------------------------------

mi-app-auth/
├── backend/        → API REST (Spring Boot)
└── frontend/       → Cliente web (React + Vite)


----------------------------------------------------------------
2. FUNCIONALIDADES PRINCIPALES
----------------------------------------------------------------

Registro de usuarios
Login tradicional (correo + contraseña + OTP)
Login sin contraseña (passwordless)
Envío de código OTP a correo
Verificación de OTP
Reenvío de OTP
Control de expiración OTP


----------------------------------------------------------------
3. REQUISITOS
----------------------------------------------------------------

Java 17+
Node 22.21.0 (usando NVM)
PostgreSQL (cualquier versión compatible)
SMTP disponible (MailHog o Mailtrap)


----------------------------------------------------------------
4. BACKEND - SPRING BOOT
----------------------------------------------------------------

1) Entrar al directorio backend:
cd backend

2) Ejecutar aplicación:
./mvnw spring-boot:run

Backend disponible en:
http://localhost:8080


----------------------------------------------------------------
4.1 Configuración de correo para OTP
----------------------------------------------------------------

Editar archivo:
backend/src/main/resources/application.properties

Ejemplo configuración desarrollo:

app.auth.expose-otp-in-response=true
app.auth.otp-exp-minutes=5
app.auth.mail.from=no-reply@local.test


MailHog:
spring.mail.host=localhost
spring.mail.port=1025
spring.mail.properties.mail.smtp.auth=false
spring.mail.properties.mail.smtp.starttls.enable=false

Mailtrap:
spring.mail.host=sandbox.smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=TU_USER
spring.mail.password=TU_PASS
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

Producción:
app.auth.expose-otp-in-response=false


----------------------------------------------------------------
5. FRONTEND - REACT + VITE
----------------------------------------------------------------

1) Entrar al directorio:
cd frontend

2) Seleccionar Node:
nvm use

3) Instalar dependencias:
npm install

4) Ejecutar servidor desarrollo:
npm run dev

Frontend disponible en:
http://localhost:5173


----------------------------------------------------------------
6. FLUJO DE AUTENTICACIÓN
----------------------------------------------------------------

6.1 Registro de usuario

curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Ana",
    "lastName":"Lopez",
    "email":"ana@example.com",
    "password":"Secret.123"
  }'


6.2 Login (correo + contraseña + OTP)

1) Login que genera OTP

curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"ana@example.com",
    "password":"Secret.123",
    "device":"Chrome/Linux"
  }'

Respuesta ejemplo (desarrollo):

{
  "message": "First factor OK. OTP sent to email.",
  "otp_demo": 123456,
  "valid_minutes": 5
}


2) Validar OTP

curl -X POST http://localhost:8080/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email":"ana@example.com",
    "code":123456
  }'


6.3 Login sin contraseña (Passwordless)

1) Solicitar OTP

curl -X POST http://localhost:8080/api/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{
    "email":"ana@example.com",
    "device":"Chrome/Linux"
  }'

2) Validar OTP
(Mismo endpoint que el flujo anterior)


----------------------------------------------------------------
7. MENSAJES DE LA INTERFAZ
----------------------------------------------------------------

Login correcto → OTP enviado
OTP correcto → Inicio de sesión correcto
OTP incorrecto → Código incorrecto
OTP expirado → Código expirado
Reenvío OTP → Nuevo código enviado


----------------------------------------------------------------
8. SEGURIDAD IMPLEMENTADA
----------------------------------------------------------------

Autenticación MFA
Login passwordless
Expiración temporal de OTP
Contraseñas con hash BCrypt
Reenvío OTP
SMTP
DTOs seguros

Recomendación producción:
app.auth.expose-otp-in-response=false


----------------------------------------------------------------
9. COMMITS - CONVENTIONAL COMMITS
----------------------------------------------------------------

Ejemplos aplicados:

feat(auth-backend): agrega endpoints OTP y login
fix(ux): mejora mensajes de verificación
docs(readme): agrega documentación principal
chore(repo): configura estructura monorepo


----------------------------------------------------------------
10. ROADMAP (SUGERENCIAS FUTURAS)
----------------------------------------------------------------

Refresh Token
Roles y permisos
Recuperación de contraseña
JWT
Auditoría / Logs avanzados


----------------------------------------------------------------
11. LICENCIA
----------------------------------------------------------------

MIT


----------------------------------------------------------------
12. AUTOR
----------------------------------------------------------------

Proyecto orientado a aprendizaje y práctica de autenticación moderna (MFA + passwordless)

