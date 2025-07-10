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

/*Table structure for table `notifications` */

DROP TABLE IF EXISTS `notifications`;

CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `rental_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('warning','late','damage','system') NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `rental_id` (`rental_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `notifications` */

insert  into `notifications`(`id`,`user_id`,`rental_id`,`title`,`message`,`type`,`is_read`,`created_at`) values 
(161,16,99,'Waktu Sewa Akan Habis','Sewa sepeda akan berakhir dalam 30 menit. Mohon segera kembalikan untuk menghindari denda.','warning',0,'2025-07-10 16:16:15');

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
  `stock_available` int NOT NULL DEFAULT '0',
  `stock_rented` int NOT NULL DEFAULT '0',
  `stock_damaged` int NOT NULL DEFAULT '0',
  `stock_lost` int NOT NULL DEFAULT '0',
  `status` enum('tersedia','disewa','rusak','hilang') NOT NULL DEFAULT 'tersedia',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `products` */

insert  into `products`(`id`,`category_id`,`name`,`image`,`description`,`price`,`stock`,`stock_available`,`stock_rented`,`stock_damaged`,`stock_lost`,`status`,`created_at`) values 
(8,8,'bike','uploads/products/1747363751148-467040440.jpg','bagus',20000.00,35,35,0,0,0,'tersedia','2025-05-01 19:06:00'),
(17,8,'sepeda','uploads/products/1752025720378-602022416.jpg','sepeda gunung murah',10000.00,20,18,2,0,0,'tersedia','2025-05-08 22:18:24');

/*Table structure for table `rental_reports` */

DROP TABLE IF EXISTS `rental_reports`;

CREATE TABLE `rental_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rental_id` int NOT NULL,
  `report_type` enum('late','damage','lost') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` text,
  `proof_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `rental_id` (`rental_id`),
  CONSTRAINT `rental_reports_ibfk_1` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `rental_reports` */

/*Table structure for table `rentals` */

DROP TABLE IF EXISTS `rentals`;

CREATE TABLE `rentals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `rental_hours` int NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `penalty_amount` decimal(10,2) DEFAULT '0.00',
  `damage_penalty` decimal(10,2) DEFAULT '0.00',
  `lost_penalty` decimal(10,2) DEFAULT '0.00',
  `status` enum('playing','returned','damaged','lost') DEFAULT 'playing',
  `return_time` datetime DEFAULT NULL,
  `damage_notes` text,
  `damage_proof` varchar(255) DEFAULT NULL,
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
  KEY `user_id` (`user_id`),
  CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `rentals_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `rentals` */

insert  into `rentals`(`id`,`product_id`,`user_id`,`customer_name`,`rental_hours`,`start_time`,`end_time`,`total_amount`,`penalty_amount`,`damage_penalty`,`lost_penalty`,`status`,`return_time`,`damage_notes`,`damage_proof`,`created_at`,`payment_status`,`payment_token`,`payment_url`,`payment_method`,`penalty_payment_status`,`penalty_payment_token`,`penalty_payment_url`) values 
(99,17,16,'frank',1,'2025-07-10 15:47:03','2025-07-10 16:47:03',10000.00,0.00,0.00,0.00,'playing',NULL,NULL,NULL,'2025-07-10 15:47:03','paid','ffd781b8-bf56-4181-8a01-b9922e3a34ad','https://app.sandbox.midtrans.com/snap/v4/redirection/ffd781b8-bf56-4181-8a01-b9922e3a34ad','gopay',NULL,NULL,NULL),
(100,17,12,'2',1,'2025-07-10 15:57:35','2025-07-10 16:57:35',10000.00,0.00,0.00,0.00,'playing',NULL,NULL,NULL,'2025-07-10 15:57:35','paid','ce52e17d-34aa-47f4-b94c-0afbb5a041a3','https://app.sandbox.midtrans.com/snap/v4/redirection/ce52e17d-34aa-47f4-b94c-0afbb5a041a3','gopay',NULL,NULL,NULL);

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
  `is_blacklisted` tinyint(1) DEFAULT '0',
  `blacklist_reason` text,
  `blacklist_date` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`level`,`phone`,`nik`,`ktp_image`,`address`,`is_blacklisted`,`blacklist_reason`,`blacklist_date`,`created_at`) values 
(8,'1','1','admin',NULL,NULL,NULL,NULL,0,NULL,NULL,'2025-04-30 13:11:42'),
(12,'2','1','user','01810101','1231231231231231','uploads/ktp/1752064700592-618332378.jpg','wrasdas',0,NULL,NULL,'2025-04-30 15:00:31'),
(15,'shaa','1','user',NULL,NULL,NULL,NULL,1,'tidak aktif','2025-07-09 18:37:19','2025-05-02 11:13:36'),
(16,'frank','1','user','08883866931','1234567890123456','uploads/ktp/1752031654108-505827655.jpg','wasdd wasd',0,NULL,NULL,'2025-07-09 10:27:34'),
(17,'coba','1','user','22121312312','1222222222222222','uploads/ktp/1752124323915-765678572.jpg','wasd ',0,NULL,NULL,'2025-07-10 12:12:03'),
(18,'cobaa','1','user','1212','1234567890123456','uploads/ktp/1752126339846-583595427.jpg','wasd',0,NULL,NULL,'2025-07-10 12:45:39');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
