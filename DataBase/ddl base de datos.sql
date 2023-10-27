DROP SCHEMA IF EXISTS `Integrador` ;

-- Crear la base de datos
CREATE SCHEMA IF NOT EXISTS `Integrador` DEFAULT CHARACTER SET utf8mb3 ;
USE `Integrador` ;


-- Crear la tabla de Roles
CREATE TABLE IF NOT EXISTS Roles (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_del_rol VARCHAR(30) NOT NULL
);

-- Crear la tabla de Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    direccion VARCHAR(30) NOT NULL,
    telefono VARCHAR(15),
    rol_id INT,
    FOREIGN KEY (rol_id) REFERENCES Roles(rol_id)
);

-- Crear la tabla de Equipos
CREATE TABLE IF NOT EXISTS Equipos (
    equipo_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_del_equipo VARCHAR(50) NOT NULL,
    pais VARCHAR(50) NOT NULL,
    liga VARCHAR(50) NOT NULL,
    año_de_fundacion INT
);

-- Crear la tabla de Tallas
CREATE TABLE IF NOT EXISTS Tallas (
    talla_id INT AUTO_INCREMENT PRIMARY KEY,
    talla VARCHAR(10) NOT NULL
);

-- Crear la tabla de Camisetas
CREATE TABLE IF NOT EXISTS Camisetas (
    camiseta_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_del_producto VARCHAR(50) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    equipo_id INT,
    talla_id INT,
    FOREIGN KEY (equipo_id) REFERENCES Equipos(equipo_id),
    FOREIGN KEY (talla_id) REFERENCES Tallas(talla_id)
);

-- Crear la tabla de Camiseta_Imagenes
CREATE TABLE IF NOT EXISTS Camiseta_Imagenes (
    imagen_id INT AUTO_INCREMENT PRIMARY KEY,
    camiseta_id INT,
    imagen_url VARCHAR(250) NOT NULL,
    FOREIGN KEY (camiseta_id) REFERENCES Camisetas(camiseta_id)
);

-- Crear la tabla de Pedidos
CREATE TABLE IF NOT EXISTS Pedidos (
    pedido_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    fecha_del_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Usuarios(user_id)
);

-- Crear la tabla de Detalles del Pedido
CREATE TABLE IF NOT EXISTS Detalles_del_Pedido (
    pedido_item_id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    camiseta_id INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES Pedidos(pedido_id),
    FOREIGN KEY (camiseta_id) REFERENCES Camisetas(camiseta_id)
);

-- Crear la tabla de Reseñas
CREATE TABLE IF NOT EXISTS Reseñas (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    camiseta_id INT,
    user_id INT,
    calificacion INT NOT NULL,
    texto_de_la_resena TEXT,
    fecha_de_la_resena TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (camiseta_id) REFERENCES Camisetas(camiseta_id),
    FOREIGN KEY (user_id) REFERENCES Usuarios(user_id)
);



INSERT INTO `integrador`.`roles` (`rol_id`, `nombre_del_rol`) VALUES ('1', 'ADMINISTRADOR');
INSERT INTO `integrador`.`roles` (`rol_id`, `nombre_del_rol`) VALUES ('2', 'USUARIO');

INSERT INTO `integrador`.`tallas` (`talla_id`, `talla`) VALUES ('1', 'S');
INSERT INTO `integrador`.`tallas` (`talla_id`, `talla`) VALUES ('2', 'M');
INSERT INTO `integrador`.`tallas` (`talla_id`, `talla`) VALUES ('3', 'L');
INSERT INTO `integrador`.`tallas` (`talla_id`, `talla`) VALUES ('4', 'XL');


ALTER TABLE `integrador`.`usuarios` 
DROP FOREIGN KEY `usuarios_ibfk_1`;
ALTER TABLE `integrador`.`usuarios` 
CHANGE COLUMN `rol_id` `rol_id` INT NULL DEFAULT 2 ;
ALTER TABLE `integrador`.`usuarios` 
ADD CONSTRAINT `usuarios_ibfk_1`
  FOREIGN KEY (`rol_id`)
  REFERENCES `integrador`.`roles` (`rol_id`);


ALTER TABLE `integrador`.`usuarios` 
ADD UNIQUE INDEX `nickname_UNIQUE` (`nickname` ASC) VISIBLE,
ADD UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE;
;

ALTER TABLE `integrador`.`camisetas` 
ADD COLUMN `imagen` VARCHAR(150) NULL AFTER `descripcion`;


INSERT INTO usuarios (nickname, password, email, nombre, apellido, direccion, telefono, rol_id) VALUES ("admin","$2b$10$jj5zoCRdEdIWCjjQ31w2HOcjA2ws//YQbX4FCcxwDsBTAtNStceW6","admin@gmail.com","admin","admin","obera",3755404040, 1)

INSERT INTO integrador.camisetas (camiseta_id, nombre_del_producto, descripcion, imagen, precio, stock, equipo_id, talla_id) VALUES (2,"Camiseta River Plate","Temporada 2023-2024","https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/401778e50ef4449d9656d40e9346b8af_9366/Camiseta_Titular_River_Plate_23-24_Blanco_HT3679_01_laydown.jpg",50000.00,1,1,2), (3,"Camiseta Independientee","Temporada 2023-2024","https://pbs.twimg.com/media/CQfjMNEWUAA3BFc.jpg",45000.00,1,2,2),(4,"Camiseta Real Madrid","Temporada 2023-2024","https://img.planetafobal.com/2013/08/real-madrid-adidas-titular-2013-2014-camiseta.jpg",60000.00,1,3,2)

INSERT INTO integrador.camisetas (camiseta_id, nombre_del_producto, descripcion, precio, stock, equipo_id, talla_id) VALUES (2,"Camiseta River Plate","Temporada 2023-2024",50000.00,1,1,2), (3,"Camiseta Independientee","Temporada 2023-2024",45000.00,1,2,2),(4,"Camiseta Real Madrid","Temporada 2023-2024",60000.00,1,3,2)

-- INSERT INTO integrador.camiseta_imagenes (camiseta_id,imagen_url) VALUES (2,"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/401778e50ef4449d9656d40e9346b8af_9366/Camiseta_Titular_River_Plate_23-24_Blanco_HT3679_01_laydown.jpg"), (3,"https://pbs.twimg.com/media/CQfjMNEWUAA3BFc.jpg"), (4,"https://img.planetafobal.com/2013/08/real-madrid-adidas-titular-2013-2014-camiseta.jpg")