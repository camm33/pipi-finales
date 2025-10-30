-- Tabla para tokens de recuperación de contraseña
USE Double_P;

CREATE TABLE IF NOT EXISTS tokens_recuperacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiracion DATETIME NOT NULL,
    usado TINYINT(1) DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tokens_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expiracion (expiracion)
);

-- Limpiar tokens expirados (opcional - se puede ejecutar periódicamente)
-- DELETE FROM tokens_recuperacion WHERE expiracion < NOW() OR usado = 1;