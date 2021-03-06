-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema delilahdatabase
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema delilahdatabase
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `delilahdatabase` DEFAULT CHARACTER SET latin1 ;
USE `delilahdatabase` ;

-- -----------------------------------------------------
-- Table `delilahdatabase`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `delilahdatabase`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(32) NOT NULL,
  `full_name` VARCHAR(32) NOT NULL,
  `email` VARCHAR(32) NOT NULL,
  `phone` VARCHAR(32) NOT NULL,
  `shipping_address` VARCHAR(120) NOT NULL,
  `password` VARCHAR(32) NOT NULL,
  `es_admin` TINYINT(1) NULL DEFAULT '0',
  `creation_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `delilahdatabase`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `delilahdatabase`.`orders` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NULL DEFAULT NULL,
  `total` FLOAT NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'NUEVO',
  `payment_method` VARCHAR(20) NOT NULL,
  `creation_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `FK_user` (`user_id` ASC) VISIBLE,
  CONSTRAINT `orders_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `delilahdatabase`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `delilahdatabase`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `delilahdatabase`.`products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `description` VARCHAR(120) NOT NULL,
  `photo_url` VARCHAR(60) NOT NULL,
  `price` FLOAT NOT NULL,
  `creation_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `available` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `delilahdatabase`.`products_per_order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `delilahdatabase`.`products_per_order` (
  `order_id` INT(11) NULL DEFAULT NULL,
  `product_id` INT(11) NULL DEFAULT NULL,
  `quantity` INT(11) NOT NULL,
  INDEX `FK_order` (`order_id` ASC) VISIBLE,
  INDEX `FK_product` (`product_id` ASC) VISIBLE,
  CONSTRAINT `products_per_order_ibfk_1`
    FOREIGN KEY (`order_id`)
    REFERENCES `delilahdatabase`.`orders` (`id`),
  CONSTRAINT `products_per_order_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `delilahdatabase`.`products` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
