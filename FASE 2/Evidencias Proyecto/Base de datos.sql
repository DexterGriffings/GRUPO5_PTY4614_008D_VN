CREATE TABLE `usuarios` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `rut` VARCHAR(12) UNIQUE NOT NULL,
  `colegio_id` INT
);

CREATE TABLE `apps_colegios` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `apps_cuestionario` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `rut` VARCHAR(12) NOT NULL,
  `colegio_id` INT NOT NULL,
  `telefono` VARCHAR(12) NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `puntaje` VARCHAR(12) NOT NULL
);

CREATE TABLE `login` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` INT,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `fecha_creacion` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE `login` ADD CONSTRAINT `fk_usuario_login` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `apps_cuestionario` ADD CONSTRAINT `fk_colegio_cuestionario` FOREIGN KEY (`colegio_id`) REFERENCES `apps_colegios` (`id`);
