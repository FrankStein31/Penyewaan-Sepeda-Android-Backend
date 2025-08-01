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
CREATE DATABASE /*!32312 IF NOT EXISTS*/`project_sewasepeda` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `project_sewasepeda`;

/*Table structure for table `categories` */

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `categories` */

insert  into `categories`(`id`,`name`) values 
(10,'coba'),
(8,'gunung'),
(9,'polygon'),
(11,'wasd');

/*Table structure for table `notifications` */

DROP TABLE IF EXISTS `notifications`;

CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `rental_id` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('warning','late','damage','system') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `rental_id` (`rental_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=626 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `notifications` */

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `stock_available` int NOT NULL DEFAULT '0',
  `stock_rented` int NOT NULL DEFAULT '0',
  `stock_damaged` int NOT NULL DEFAULT '0',
  `stock_lost` int NOT NULL DEFAULT '0',
  `status` enum('tersedia','disewa','rusak','hilang') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tersedia',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `serial_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `idx_products_serial_number` (`serial_number`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `products` */

insert  into `products`(`id`,`category_id`,`name`,`image`,`description`,`price`,`stock`,`stock_available`,`stock_rented`,`stock_damaged`,`stock_lost`,`status`,`created_at`,`serial_number`) values 
(8,8,'bike','uploads/products/1747363751148-467040440.jpg','bagus',20000.00,37,37,0,0,0,'tersedia','2025-05-01 19:06:00','BIKE-001'),
(17,8,'sepeda','uploads/products/1752025720378-602022416.jpg','sepeda gunung murah',10000.00,23,23,0,0,0,'tersedia','2025-05-08 22:18:24','SEPEDA-001'),
(18,8,'wasd','uploads/products/1753963839630-266537247.jpg','wasd',25000.00,12,12,0,0,0,'tersedia','2025-07-31 19:10:39','WASD-001'),
(20,9,'cobaa','uploads/products/1753971353925-749823863.jpg','wasdwasd',30000.00,13,13,0,0,0,'tersedia','2025-07-31 21:15:53',NULL);

/*Table structure for table `rental_reports` */

DROP TABLE IF EXISTS `rental_reports`;

CREATE TABLE `rental_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rental_id` int NOT NULL,
  `report_type` enum('late','damage','lost') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `proof_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `rental_id` (`rental_id`),
  CONSTRAINT `rental_reports_ibfk_1` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `rental_reports` */

insert  into `rental_reports`(`id`,`rental_id`,`report_type`,`amount`,`description`,`proof_image`,`created_at`) values 
(1,100,'late',143000.00,'Denda keterlambatan',NULL,'2025-07-10 19:20:26'),
(2,99,'late',310000.00,'Denda keterlambatan',NULL,'2025-07-10 21:31:28'),
(3,102,'late',8512000.00,'Denda keterlambatan',NULL,'2025-07-16 19:35:33'),
(4,103,'late',21555000.00,'Denda keterlambatan',NULL,'2025-07-31 19:29:07'),
(5,106,'late',8000.00,'Denda keterlambatan',NULL,'2025-08-01 10:22:29');

/*Table structure for table `rentals` */

DROP TABLE IF EXISTS `rentals`;

CREATE TABLE `rentals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `customer_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rental_hours` int NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `penalty_amount` decimal(10,2) DEFAULT '0.00',
  `damage_penalty` decimal(10,2) DEFAULT '0.00',
  `lost_penalty` decimal(10,2) DEFAULT '0.00',
  `status` enum('playing','returned','damaged','lost') COLLATE utf8mb4_unicode_ci DEFAULT 'playing',
  `return_time` datetime DEFAULT NULL,
  `damage_notes` text COLLATE utf8mb4_unicode_ci,
  `damage_proof` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_status` enum('pending','paid','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `penalty_payment_status` enum('pending','paid','failed') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `penalty_payment_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `penalty_payment_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serial_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_rentals_serial_number` (`serial_number`),
  CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `rentals_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `rentals` */

insert  into `rentals`(`id`,`product_id`,`user_id`,`customer_name`,`rental_hours`,`start_time`,`end_time`,`total_amount`,`penalty_amount`,`damage_penalty`,`lost_penalty`,`status`,`return_time`,`damage_notes`,`damage_proof`,`created_at`,`payment_status`,`payment_token`,`payment_url`,`payment_method`,`penalty_payment_status`,`penalty_payment_token`,`penalty_payment_url`,`serial_number`) values 
(99,17,16,'frank',1,'2025-07-10 15:22:03','2025-07-10 16:22:03',10000.00,310000.00,0.00,0.00,'returned','2025-07-10 21:31:28',NULL,NULL,'2025-07-10 15:47:03','paid','ffd781b8-bf56-4181-8a01-b9922e3a34ad','https://app.sandbox.midtrans.com/snap/v4/redirection/ffd781b8-bf56-4181-8a01-b9922e3a34ad','gopay','paid','8541b699-5eb3-454c-a9a3-66eb9aff6472','https://app.sandbox.midtrans.com/snap/v4/redirection/8541b699-5eb3-454c-a9a3-66eb9aff6472','SEPEDA-001'),
(100,17,12,'2',1,'2025-07-10 15:57:35','2025-07-10 16:57:35',10000.00,143000.00,0.00,0.00,'returned','2025-07-10 19:20:26',NULL,NULL,'2025-07-10 15:57:35','paid','ce52e17d-34aa-47f4-b94c-0afbb5a041a3','https://app.sandbox.midtrans.com/snap/v4/redirection/ce52e17d-34aa-47f4-b94c-0afbb5a041a3','gopay','paid','06edb24a-0104-447e-8d09-7bfe86d635fd','https://app.sandbox.midtrans.com/snap/v4/redirection/06edb24a-0104-447e-8d09-7bfe86d635fd','SEPEDA-002'),
(101,8,12,'2',1,'2025-07-10 20:47:19','2025-07-10 21:47:19',20000.00,0.00,0.00,0.00,'returned','2025-07-10 20:48:52',NULL,NULL,'2025-07-10 20:47:19','paid','1703fcb4-9fa8-46ad-8afc-0cbc7fdac502','https://app.sandbox.midtrans.com/snap/v4/redirection/1703fcb4-9fa8-46ad-8afc-0cbc7fdac502','gopay',NULL,NULL,NULL,'BIKE-001'),
(102,8,12,'2',1,'2025-07-10 20:44:01','2025-07-10 21:44:01',20000.00,8512000.00,0.00,0.00,'returned','2025-07-16 19:35:33',NULL,NULL,'2025-07-10 21:40:01','paid','62d26db6-7b13-427e-82b1-81a95f20c41f','https://app.sandbox.midtrans.com/snap/v4/redirection/62d26db6-7b13-427e-82b1-81a95f20c41f','gopay','paid','1673a9f5-1465-4907-bf8f-00a55acb2319','https://app.sandbox.midtrans.com/snap/v4/redirection/1673a9f5-1465-4907-bf8f-00a55acb2319','BIKE-002'),
(103,17,12,'2',1,'2025-07-16 19:14:15','2025-07-16 20:14:15',10000.00,21555000.00,0.00,0.00,'returned','2025-07-31 19:29:07',NULL,NULL,'2025-07-16 20:14:15','paid','fbea7091-1fb3-46ab-98ee-ef6c465e5930','https://app.sandbox.midtrans.com/snap/v4/redirection/fbea7091-1fb3-46ab-98ee-ef6c465e5930','gopay','paid','04a2f1f7-a48b-4bc2-9a75-d13d98ee644a','https://app.sandbox.midtrans.com/snap/v4/redirection/04a2f1f7-a48b-4bc2-9a75-d13d98ee644a','SEPEDA-003'),
(104,20,12,'2',1,'2025-08-01 09:40:05','2025-08-01 10:40:05',30000.00,0.00,0.00,0.00,'returned','2025-08-01 09:45:38',NULL,NULL,'2025-08-01 09:40:05','paid','48ff4d19-8868-468e-9fe9-669bfc31c033','https://app.sandbox.midtrans.com/snap/v4/redirection/48ff4d19-8868-468e-9fe9-669bfc31c033','gopay',NULL,NULL,NULL,'WASD-002-1754016005306-613'),
(105,20,12,'2',1,'2025-08-01 09:46:28','2025-08-01 10:46:28',30000.00,0.00,0.00,0.00,'returned','2025-08-01 09:48:40',NULL,NULL,'2025-08-01 09:46:28','paid','d4a1e859-3d49-4f39-abb3-00ce7231ac4a','https://app.sandbox.midtrans.com/snap/v4/redirection/d4a1e859-3d49-4f39-abb3-00ce7231ac4a','gopay',NULL,NULL,NULL,'WASD-002-1754016388327-326'),
(106,20,12,'2',1,'2025-08-01 10:15:14','2025-08-01 10:15:03',30000.00,8000.00,0.00,0.00,'returned','2025-08-01 10:22:29',NULL,NULL,'2025-08-01 09:49:07','paid','916bc913-98d0-43d3-b962-b31333a2dd78','https://app.sandbox.midtrans.com/snap/v4/redirection/916bc913-98d0-43d3-b962-b31333a2dd78','gopay','paid','b060c618-85ac-4e9a-8565-eba89c48bdfb','https://app.sandbox.midtrans.com/snap/v4/redirection/b060c618-85ac-4e9a-8565-eba89c48bdfb','PRODUCT-20-1754016547591-594');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` enum('admin','user') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nik` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ktp_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `is_blacklisted` tinyint(1) DEFAULT '0',
  `blacklist_reason` text COLLATE utf8mb4_unicode_ci,
  `blacklist_date` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`level`,`phone`,`nik`,`ktp_image`,`profile_image`,`address`,`is_blacklisted`,`blacklist_reason`,`blacklist_date`,`created_at`) values 
(8,'1','1','admin',NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,'2025-04-30 13:11:42'),
(12,'2','1','user','01810101','1231231231231231','uploads/ktp/1752064700592-618332378.jpg','uploads/profile/1753967375771-381726168.jpg','wrasdas',0,NULL,NULL,'2025-04-30 15:00:31'),
(15,'shaa','1','user',NULL,NULL,NULL,NULL,NULL,1,'tidak aktif','2025-07-09 18:37:19','2025-05-02 11:13:36'),
(16,'frank','1','user','08883866931','1234567890123456','uploads/ktp/1752031654108-505827655.jpg',NULL,'wasdd wasd',0,NULL,NULL,'2025-07-09 10:27:34'),
(17,'coba','1','user','22121312312','1222222222222222','uploads/ktp/1752124323915-765678572.jpg',NULL,'wasd ',0,NULL,NULL,'2025-07-10 12:12:03'),
(18,'cobaa','1','user','1212','1234567890123456','uploads/ktp/1752126339846-583595427.jpg',NULL,'wasd',0,NULL,NULL,'2025-07-10 12:45:39');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
