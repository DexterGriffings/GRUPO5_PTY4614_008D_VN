-- Tabla de Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rut VARCHAR(12) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    colegio_id INT,
    curso_id INT,
    CONSTRAINT fk_colegio FOREIGN KEY (colegio_id) REFERENCES colegios(id),
    CONSTRAINT fk_curso FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

-- Tabla de Colegios
CREATE TABLE colegios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de Cursos
CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de Pruebas
CREATE TABLE pruebas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    respuestas_csv VARCHAR(255)
);

-- Tabla de Resultados (Relaciona cada usuario con una prueba específica)
CREATE TABLE resultados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    prueba_id INT,
    puntaje DECIMAL(5,2),
    fecha_realizacion DATE,
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_prueba FOREIGN KEY (prueba_id) REFERENCES pruebas(id),
    UNIQUE (usuario_id, prueba_id) -- Evita que el mismo usuario haga la misma prueba más de una vez
);

-- Tabla de Login (Para el inicio de sesión)
CREATE TABLE login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Guardar contraseña encriptada
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_login FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);