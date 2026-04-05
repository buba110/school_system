-- =====================================================
-- SISTEMA DE CONTROL ESCOLAR - BASE DE DATOS COMPLETA
-- =====================================================
CREATE DATABASE IF NOT EXISTS school_control;
USE school_control;

-- Tablas principales
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol_id INT NOT NULL,
  activo BOOLEAN DEFAULT 1,
  fecha_expiracion DATE NULL,
  creado_por INT NULL,
  FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS grados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  nivel VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS grupos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(20) NOT NULL,
  grado_id INT NOT NULL,
  FOREIGN KEY (grado_id) REFERENCES grados(id)
);

CREATE TABLE IF NOT EXISTS materias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  grado_id INT NOT NULL,
  FOREIGN KEY (grado_id) REFERENCES grados(id)
);

CREATE TABLE IF NOT EXISTS alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  matricula VARCHAR(20) UNIQUE NOT NULL,
  nombre_completo VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE,
  tutor_nombre VARCHAR(100),
  tutor_telefono VARCHAR(20),
  tutor_email VARCHAR(100),
  direccion TEXT,
  activo BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS inscripciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alumno_id INT NOT NULL,
  grupo_id INT NOT NULL,
  ciclo_escolar VARCHAR(9) NOT NULL,
  fecha_inscripcion DATE,
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
  FOREIGN KEY (grupo_id) REFERENCES grupos(id)
);

CREATE TABLE IF NOT EXISTS colegiaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alumno_id INT NOT NULL,
  mes INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  pagado BOOLEAN DEFAULT 0,
  fecha_vencimiento DATE,
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id)
);

CREATE TABLE IF NOT EXISTS pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL,
  referencia_id INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(30),
  fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS proveedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  contacto VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion TEXT
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  stock_minimo INT DEFAULT 5,
  proveedor_id INT,
  activo BOOLEAN DEFAULT 1,
  FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

CREATE TABLE IF NOT EXISTS movimientos_inventario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  cantidad INT NOT NULL,
  motivo VARCHAR(255),
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT NOT NULL,
  FOREIGN KEY (producto_id) REFERENCES productos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  folio VARCHAR(20) UNIQUE NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(30),
  usuario_id INT NOT NULL,
  anulada BOOLEAN DEFAULT 0,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS detalles_venta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (venta_id) REFERENCES ventas(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS cortes_caja (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  fecha_apertura DATETIME NOT NULL,
  fecha_cierre DATETIME,
  monto_apertura DECIMAL(10,2) DEFAULT 0,
  monto_cierre DECIMAL(10,2),
  total_ventas DECIMAL(10,2) DEFAULT 0,
  total_colegiaturas DECIMAL(10,2) DEFAULT 0,
  diferencia DECIMAL(10,2) DEFAULT 0,
  estado VARCHAR(20) DEFAULT 'abierto',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Datos de prueba (usuario admin con contraseña 123456)
INSERT IGNORE INTO roles (nombre) VALUES ('administrador'), ('subadmin'), ('cajero'), ('docente'), ('padre');
INSERT IGNORE INTO usuarios (nombre_completo, email, password_hash, rol_id, activo) VALUES
('Admin Principal', 'admin@escuela.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1);