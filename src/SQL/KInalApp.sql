CREATE DATABASE IF NOT EXISTS KinalApp;
USE KinalApp;

CREATE TABLE Clientes (
    dpi_cliente INT PRIMARY KEY,
    nombre_cliente VARCHAR(50),
    apellido_cliente VARCHAR(50),
    direccion VARCHAR(100),
    estado INT
);

CREATE TABLE Usuarios (
    codigo_usuario INT PRIMARY KEY,
    username VARCHAR(45),
    password VARCHAR(45),
    email VARCHAR(60),
    rol VARCHAR(45),
    estado INT
);

CREATE TABLE Productos (
    codigo_producto INT PRIMARY KEY,
    nombre_producto VARCHAR(60),
    precio DECIMAL(10,2),
    stock INT,
    estado INT
);

CREATE TABLE Ventas (
    codigo_venta INT PRIMARY KEY,
    fecha_venta DATE,
    total DECIMAL(10,2),
    estado INT,
    Clientes_dpi_cliente INT,
    Usuarios_codigo_usuario INT,
    FOREIGN KEY (Clientes_dpi_cliente) REFERENCES Clientes(dpi_cliente),
    FOREIGN KEY (Usuarios_codigo_usuario) REFERENCES Usuarios(codigo_usuario)
);

CREATE TABLE DetalleVenta (
    codigo_detalle_venta INT PRIMARY KEY,
    cantidad INT,
    precio_unitario DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    Productos_codigo_producto INT,
    Ventas_codigo_venta INT,
    FOREIGN KEY (Productos_codigo_producto) REFERENCES Productos(codigo_producto),
    FOREIGN KEY (Ventas_codigo_venta) REFERENCES Ventas(codigo_venta)
);