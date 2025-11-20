\set ON_ERROR_STOP on

-- 1) Crear la base de datos login2 si no existe (usando psql \gexec)
SELECT 'CREATE DATABASE login2'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'login2') \gexec

-- 2) Conectarse a la nueva base
\connect login2

-- 3) Esquema (opcional; usamos public por defecto)
-- CREATE SCHEMA IF NOT EXISTS app AUTHORIZATION postgres;
-- SET search_path TO app, public;

-- 4) Tabla USUARIO
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre          VARCHAR(50)  NOT NULL,
  apellido        VARCHAR(50)  NOT NULL,
  contrasena      VARCHAR(255) NOT NULL,              -- guarda hash (BCrypt/Argon2), no texto plano
  correo          VARCHAR(150) NOT NULL UNIQUE,       -- único por correo
  fecha_creacion  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  enable          BOOLEAN      NOT NULL DEFAULT TRUE
);

-- 5) Tabla CODIGO_OTP
CREATE TABLE IF NOT EXISTS codigo_otp (
  id_otp           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo           CHAR(6)      NOT NULL CHECK (codigo ~ '^\d{6}$'), -- exactamente 6 dígitos
  fecha_creacion   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  fecha_expiracion TIMESTAMPTZ  NOT NULL DEFAULT (now() + interval '5 minutes'),
  usado            BOOLEAN      NOT NULL DEFAULT FALSE,
  dispositivo      VARCHAR(100),
  id_usuario       BIGINT       NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- 6) Índice parcial para búsquedas de OTP vigente/no usado por usuario
CREATE INDEX IF NOT EXISTS idx_otp_active
  ON codigo_otp (id_usuario, codigo)
  WHERE usado = FALSE AND fecha_expiracion > now();

-- (Opcional) Si prefieres guardar código como INTEGER (pierde ceros a la izquierda):
-- ALTER TABLE codigo_otp
--   ALTER COLUMN codigo TYPE INTEGER USING codigo::integer,
--   DROP CONSTRAINT codigo_otp_codigo_check,
--   ADD CONSTRAINT codigo_otp_codigo_chk CHECK (codigo BETWEEN 0 AND 999999);

-- 7) Prueba rápida (opcional)
-- INSERT INTO usuario (nombre, apellido, contrasena, correo) VALUES ('Ada','Lovelace','<hash>','ada@example.com');
-- INSERT INTO codigo_otp (codigo, id_usuario, dispositivo) VALUES ('123456', 1, 'Chrome/Linux');
-- SELECT * FROM codigo_otp WHERE id_usuario = 1;
