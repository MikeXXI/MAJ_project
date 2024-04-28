CREATE DATABASE IF NOT EXISTS `mydatabase` 
DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `mydatabase`;

CREATE TABLE IF NOT EXISTS `users` (
  `_id` INT(11) NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(255) NOT NULL,
  `lastname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `dateBirth` DATE NOT NULL,
  `postalCode` VARCHAR(255) NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO users (firstname, lastname, email, dateBirth, postalCode, city) 
VALUES ('John', 'Doe', 'john@doe.fr', '1980-01-01', '75001', 'Paris');