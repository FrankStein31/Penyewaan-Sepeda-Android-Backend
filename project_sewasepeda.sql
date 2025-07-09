/*
SQLyog Enterprise
MySQL - 8.0.30 : Database - project_sewasepeda
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`project_sewasepeda` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `project_sewasepeda`;

/*Table structure for table `categories` */

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `categories` */

insert  into `categories`(`id`,`name`) values 
(8,'gunung');

/*Table structure for table `payment_methods` */

DROP TABLE IF EXISTS `payment_methods`;

CREATE TABLE `payment_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `payment_methods` */

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `products` */

insert  into `products`(`id`,`category_id`,`name`,`image`,`description`,`price`,`stock`,`created_at`) values 
(8,8,'bike','uploads/products/1747363751148-467040440.jpg','bagus',20000.00,37,'2025-05-01 19:06:00'),
(17,8,'qq','uploads/products/1752025720378-602022416.jpg','qq',11.00,20,'2025-05-08 22:18:24');

/*Table structure for table `rentals` */

DROP TABLE IF EXISTS `rentals`;

CREATE TABLE `rentals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `rental_hours` int NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `penalty_amount` decimal(10,2) DEFAULT '0.00',
  `status` enum('playing','returned') DEFAULT 'playing',
  `return_time` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_status` enum('pending','paid','cancelled') DEFAULT 'pending',
  `payment_token` varchar(255) DEFAULT NULL,
  `payment_url` varchar(255) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `penalty_payment_status` enum('pending','paid','failed') DEFAULT NULL,
  `penalty_payment_token` varchar(255) DEFAULT NULL,
  `penalty_payment_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `rentals` */

insert  into `rentals`(`id`,`product_id`,`customer_name`,`rental_hours`,`start_time`,`end_time`,`total_amount`,`penalty_amount`,`status`,`return_time`,`created_at`,`payment_status`,`payment_token`,`payment_url`,`payment_method`,`penalty_payment_status`,`penalty_payment_token`,`penalty_payment_url`) values 
(93,8,'2',1,'2025-07-09 07:37:15','2025-07-09 08:43:25',20000.00,20000.00,'returned','2025-07-09 08:43:25','2025-07-09 08:37:14','paid','e60cc3eb-9c64-4682-b6e5-a199c598716f','https://app.sandbox.midtrans.com/snap/v4/redirection/e60cc3eb-9c64-4682-b6e5-a199c598716f','gopay','pending','4a1fe04a-4b57-4e0b-a97c-6e4be9a30d84','https://app.sandbox.midtrans.com/snap/v4/redirection/4a1fe04a-4b57-4e0b-a97c-6e4be9a30d84');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `level` enum('admin','user') NOT NULL DEFAULT 'user',
  `phone` varchar(15) DEFAULT NULL,
  `nik` varchar(16) DEFAULT NULL,
  `ktp_image` varchar(255) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`level`,`phone`,`nik`,`ktp_image`,`address`,`created_at`) values 
(8,'1','1','admin',NULL,NULL,NULL,NULL,'2025-04-30 13:11:42'),
(12,'2','1','user',NULL,NULL,NULL,NULL,'2025-04-30 15:00:31'),
(15,'shaa','1','user',NULL,NULL,NULL,NULL,'2025-05-02 11:13:36'),
(16,'frank','1','user','08883866931','1234567890123456','uploads/ktp/1752031654108-505827655.jpg','wasdd wasd','2025-07-09 10:27:34');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
