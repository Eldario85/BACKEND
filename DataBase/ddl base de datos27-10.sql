-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `integrador` ;
-- Schema integrador
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema integrador
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `integrador` DEFAULT CHARACTER SET utf8mb3 ;
USE `integrador` ;

-- -----------------------------------------------------
-- Table `integrador`.`equipos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrador`.`equipos` (
  `equipo_id` INT NOT NULL AUTO_INCREMENT,
  `nombre_del_equipo` VARCHAR(50) NOT NULL,
  `pais` VARCHAR(50) NOT NULL,
  `liga` VARCHAR(50) NOT NULL,
  `año_de_fundacion` INT NULL DEFAULT NULL,
  PRIMARY KEY (`equipo_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `integrador`.`tallas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrador`.`tallas` (
  `talla_id` INT NOT NULL AUTO_INCREMENT,
  `talla` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`talla_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `integrador`.`camisetas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrador`.`camisetas` (
  `camiseta_id` INT NOT NULL AUTO_INCREMENT,
  `nombre_del_producto` VARCHAR(50) NOT NULL,
  `descripcion` TEXT NULL DEFAULT NULL,
  `imagen` VARCHAR(250) NULL DEFAULT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL,
  `equipo_id` INT NULL DEFAULT NULL,
  `talla_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`camiseta_id`),
  INDEX `equipo_id` (`equipo_id` ASC) VISIBLE,
  INDEX `talla_id` (`talla_id` ASC) VISIBLE,
  CONSTRAINT `camisetas_ibfk_1`
    FOREIGN KEY (`equipo_id`)
    REFERENCES `integrador`.`equipos` (`equipo_id`),
  CONSTRAINT `camisetas_ibfk_2`
    FOREIGN KEY (`talla_id`)
    REFERENCES `integrador`.`tallas` (`talla_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `integrador`.`camiseta_imagenes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrador`.`camiseta_imagenes` (
  `imagen_id` INT NOT NULL AUTO_INCREMENT,
  `camiseta_id` INT NULL DEFAULT NULL,
  `imagen_url` VARCHAR(250) NOT NULL,
  PRIMARY KEY (`imagen_id`),
  INDEX `camiseta_id` (`camiseta_id` ASC) VISIBLE,
  CONSTRAINT `camiseta_imagenes_ibfk_1`
    FOREIGN KEY (`camiseta_id`)
    REFERENCES `integrador`.`camisetas` (`camiseta_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `integrador`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrador`.`roles` (
  `rol_id` INT NOT NULL AUTO_INCREMENT,
  `nombre_del_rol` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`rol_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `integrador`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrador`.`usuarios` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `nickname` VARCHAR(30) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(30) NOT NULL,
  `apellido` VARCHAR(30) NOT NULL,
  `direccion` VARCHAR(30) NOT NULL,
  `telefono` VARCHAR(15) NULL DEFAULT NULL,
  `rol_id` INT NULL DEFAULT '2',
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `nickname_UNIQUE` (`nickname` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `usuarios_ibfk_1` (`rol_id` ASC) VISIBLE,
  CONSTRAINT `usuarios_ibfk_1`
    FOREIGN KEY (`rol_id`)
    REFERENCES `integrador`.`roles` (`rol_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `integrador`.`carrito`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrador`.`carrito` (
  `carrito_item_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `camiseta_id` INT NULL DEFAULT NULL,
  `cantidad` INT NULL DEFAULT NULL,
  PRIMARY KEY (`carrito_item_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `camiseta_id` (`camiseta_id` ASC) VISIBLE,
  CONSTRAINT `carrito_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `integrador`.`usuarios` (`user_id`),
  CONSTRAINT `carrito_ibfk_2`
    FOREIGN KEY (`camiseta_id`)
    REFERENCES `integrador`.`camisetas` (`camiseta_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `integrador`.`pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrador`.`pedidos` (
  `pedido_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `fecha_del_pedido` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `total` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`pedido_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `integrador`.`detalles_del_pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrador`.`detalles_del_pedido` (
  `pedido_item_id` INT NOT NULL AUTO_INCREMENT,
  `pedido_id` INT NULL DEFAULT NULL,
  `camiseta_id` INT NULL DEFAULT NULL,
  `cantidad` INT NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`pedido_item_id`),
  INDEX `pedido_id` (`pedido_id` ASC) VISIBLE,
  INDEX `camiseta_id` (`camiseta_id` ASC) VISIBLE,
  CONSTRAINT `detalles_del_pedido_ibfk_1`
    FOREIGN KEY (`pedido_id`)
    REFERENCES `integrador`.`pedidos` (`pedido_id`),
  CONSTRAINT `detalles_del_pedido_ibfk_2`
    FOREIGN KEY (`camiseta_id`)
    REFERENCES `integrador`.`camisetas` (`camiseta_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `integrador`.`reseñas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrador`.`reseñas` (
  `review_id` INT NOT NULL AUTO_INCREMENT,
  `camiseta_id` INT NULL DEFAULT NULL,
  `user_id` INT NULL DEFAULT NULL,
  `calificacion` INT NOT NULL,
  `texto_de_la_resena` TEXT NULL DEFAULT NULL,
  `fecha_de_la_resena` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  INDEX `camiseta_id` (`camiseta_id` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `reseñas_ibfk_1`
    FOREIGN KEY (`camiseta_id`)
    REFERENCES `integrador`.`camisetas` (`camiseta_id`),
  CONSTRAINT `reseñas_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `integrador`.`usuarios` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

INSERT INTO `integrador`.`roles` (`rol_id`, `nombre_del_rol`) VALUES ('1', 'ADMINISTRADOR');
INSERT INTO `integrador`.`roles` (`rol_id`, `nombre_del_rol`) VALUES ('2', 'USUARIO');

INSERT INTO `integrador`.`tallas` (`talla_id`, `talla`) VALUES ('1', 'S');
INSERT INTO `integrador`.`tallas` (`talla_id`, `talla`) VALUES ('2', 'M');
INSERT INTO `integrador`.`tallas` (`talla_id`, `talla`) VALUES ('3', 'L');
INSERT INTO `integrador`.`tallas` (`talla_id`, `talla`) VALUES ('4', 'XL');

INSERT INTO `integrador`.`equipos` (`equipo_id`, `nombre_del_equipo`, `pais`, `liga`, `año_de_fundacion`) VALUES ('1', 'River Plate', 'Argentina', 'Argentina', '1901');
INSERT INTO `integrador`.`equipos` (`equipo_id`, `nombre_del_equipo`, `pais`, `liga`, `año_de_fundacion`) VALUES ('2', 'Independiente', 'Argentina', 'Argentina', '1905');
INSERT INTO `integrador`.`equipos` (`equipo_id`, `nombre_del_equipo`, `pais`, `liga`, `año_de_fundacion`) VALUES ('3', 'Real Madrid', 'España', 'La Liga', '1920');
INSERT INTO `integrador`.`equipos` (`equipo_id`, `nombre_del_equipo`, `pais`, `liga`, `año_de_fundacion`) VALUES ('4', 'Inter Miami', 'EEUU', 'MLS', '2018');
INSERT INTO `integrador`.`equipos` (`equipo_id`, `nombre_del_equipo`, `pais`, `liga`, `año_de_fundacion`) VALUES ('5', 'Bayern Munich', 'Alemania', 'BundesLiga', '1900');
INSERT INTO `integrador`.`equipos` (`equipo_id`, `nombre_del_equipo`, `pais`, `liga`, `año_de_fundacion`) VALUES ('6', 'Boca Juniors', 'Argentina', 'Liga Argentina', '1905');
INSERT INTO `integrador`.`equipos` (`equipo_id`, `nombre_del_equipo`, `pais`, `liga`, `año_de_fundacion`) VALUES ('7', 'Racing Club', 'Argentina', 'Liga Argentina', '1903');
INSERT INTO `integrador`.`equipos` (`equipo_id`, `nombre_del_equipo`, `pais`, `liga`, `año_de_fundacion`) VALUES ('8', 'FC Barcelona', 'España', 'La Liga', '1899');
INSERT INTO `integrador`.`equipos` (`equipo_id`, `nombre_del_equipo`, `pais`, `liga`, `año_de_fundacion`) VALUES ('9', 'Manchester United', 'Inglaterra', 'Premier League', '1878');
INSERT INTO `integrador`.`equipos` (`equipo_id`, `nombre_del_equipo`, `pais`, `liga`, `año_de_fundacion`) VALUES ('10', 'Manchester City', 'Inglaterra', 'Premier League', '1894');





INSERT INTO usuarios (nickname, password, email, nombre, apellido, direccion, telefono, rol_id) VALUES ("admin","$2b$10$jj5zoCRdEdIWCjjQ31w2HOcjA2ws//YQbX4FCcxwDsBTAtNStceW6","admin@gmail.com","admin","admin","obera",3755404040, 1);

INSERT INTO integrador.camisetas (camiseta_id, nombre_del_producto, descripcion, imagen, precio, stock, equipo_id, talla_id) VALUES (2,"Camiseta River Plate","Temporada 2023-2024","https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/401778e50ef4449d9656d40e9346b8af_9366/Camiseta_Titular_River_Plate_23-24_Blanco_HT3679_01_laydown.jpg",50000.00,1,1,2), (3,"Camiseta Independientee","Temporada 2023-2024","https://pbs.twimg.com/media/CQfjMNEWUAA3BFc.jpg",45000.00,1,2,2),(4,"Camiseta Real Madrid","Temporada 2023-2024","https://img.planetafobal.com/2013/08/real-madrid-adidas-titular-2013-2014-camiseta.jpg",60000.00,1,3,2);
