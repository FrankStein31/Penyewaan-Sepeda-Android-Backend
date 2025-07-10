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
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `notifications` */

insert  into `notifications`(`id`,`user_id`,`rental_id`,`title`,`message`,`type`,`is_read`,`created_at`) values 
(29,16,96,'Waktu Sewa Akan Habis','Sewa qq akan berakhir dalam 8 menit. Mohon segera kembalikan untuk menghindari denda.','warning',0,'2025-07-09 20:11:22'),
(30,16,96,'Waktu Sewa Akan Habis','Sewa qq akan berakhir dalam 7 menit. Mohon segera kembalikan untuk menghindari denda.','warning',0,'2025-07-09 20:12:22'),
(31,16,96,'Waktu Sewa Akan Habis','Sewa qq akan berakhir dalam 6 menit. Mohon segera kembalikan untuk menghindari denda.','warning',0,'2025-07-09 20:13:22'),
(32,16,96,'Waktu Sewa Akan Habis','Sewa qq akan berakhir dalam 5 menit. Mohon segera kembalikan untuk menghindari denda.','warning',0,'2025-07-09 20:14:22'),
(33,16,96,'Waktu Sewa Akan Habis','Sewa qq akan berakhir dalam 4 menit. Mohon segera kembalikan untuk menghindari denda.','warning',0,'2025-07-09 20:15:22'),
(34,16,96,'Waktu Sewa Akan Habis','Sewa qq akan berakhir dalam 3 menit. Mohon segera kembalikan untuk menghindari denda.','warning',0,'2025-07-09 20:16:22'),
(35,16,96,'Waktu Sewa Akan Habis','Sewa qq akan berakhir dalam 2 menit. Mohon segera kembalikan untuk menghindari denda.','warning',0,'2025-07-09 20:17:22'),
(36,16,96,'Waktu Sewa Akan Habis','Sewa qq akan berakhir dalam 1 menit. Mohon segera kembalikan untuk menghindari denda.','warning',0,'2025-07-09 20:18:22'),
(37,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 0 menit. Denda: Rp0','late',0,'2025-07-09 20:20:22'),
(38,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 1 menit. Denda: Rp11','late',0,'2025-07-09 20:21:22'),
(39,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 2 menit. Denda: Rp11','late',0,'2025-07-09 20:22:22'),
(40,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 3 menit. Denda: Rp11','late',0,'2025-07-09 20:23:22'),
(41,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 937 menit. Denda: Rp2068','late',0,'2025-07-10 11:57:25'),
(42,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 938 menit. Denda: Rp2068','late',0,'2025-07-10 11:58:25'),
(43,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 939 menit. Denda: Rp2068','late',0,'2025-07-10 11:59:25'),
(44,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 940 menit. Denda: Rp2068','late',0,'2025-07-10 12:00:25'),
(45,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 941 menit. Denda: Rp2079','late',0,'2025-07-10 12:01:25'),
(46,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 944 menit. Denda: Rp2079','late',0,'2025-07-10 12:04:41'),
(47,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 945 menit. Denda: Rp2079','late',0,'2025-07-10 12:05:41'),
(48,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 946 menit. Denda: Rp2090','late',0,'2025-07-10 12:06:41'),
(49,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 947 menit. Denda: Rp2090','late',0,'2025-07-10 12:07:41'),
(50,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 948 menit. Denda: Rp2090','late',0,'2025-07-10 12:08:41'),
(51,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 949 menit. Denda: Rp2090','late',0,'2025-07-10 12:09:41'),
(52,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 950 menit. Denda: Rp2090','late',0,'2025-07-10 12:10:41'),
(53,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 951 menit. Denda: Rp2101','late',0,'2025-07-10 12:11:41'),
(54,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 952 menit. Denda: Rp2101','late',0,'2025-07-10 12:12:41'),
(55,17,NULL,'Akun Di-blacklist','Akun Anda telah di-blacklist dengan alasan: gabut','system',0,'2025-07-10 12:13:35'),
(56,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 953 menit. Denda: Rp2101','late',0,'2025-07-10 12:13:41'),
(57,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 954 menit. Denda: Rp2101','late',0,'2025-07-10 12:14:41'),
(58,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 955 menit. Denda: Rp2101','late',0,'2025-07-10 12:15:41'),
(59,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 956 menit. Denda: Rp2112','late',0,'2025-07-10 12:16:41'),
(60,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 957 menit. Denda: Rp2112','late',0,'2025-07-10 12:17:41'),
(61,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 958 menit. Denda: Rp2112','late',0,'2025-07-10 12:18:41'),
(62,17,NULL,'Blacklist Dihapus','Akun Anda telah dihapus dari daftar blacklist','system',0,'2025-07-10 12:19:37'),
(63,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 959 menit. Denda: Rp2112','late',0,'2025-07-10 12:19:41'),
(64,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 960 menit. Denda: Rp2112','late',0,'2025-07-10 12:20:41'),
(65,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 961 menit. Denda: Rp2123','late',0,'2025-07-10 12:21:41'),
(66,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 962 menit. Denda: Rp2123','late',0,'2025-07-10 12:22:41'),
(67,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 963 menit. Denda: Rp2123','late',0,'2025-07-10 12:23:41'),
(68,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 964 menit. Denda: Rp2123','late',0,'2025-07-10 12:24:41'),
(69,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 965 menit. Denda: Rp2123','late',0,'2025-07-10 12:25:41'),
(70,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 966 menit. Denda: Rp2134','late',0,'2025-07-10 12:26:41'),
(71,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 967 menit. Denda: Rp2134','late',0,'2025-07-10 12:27:41'),
(72,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 968 menit. Denda: Rp2134','late',0,'2025-07-10 12:28:41'),
(73,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 969 menit. Denda: Rp2134','late',0,'2025-07-10 12:29:41'),
(74,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 970 menit. Denda: Rp2134','late',0,'2025-07-10 12:30:41'),
(75,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 971 menit. Denda: Rp2145','late',0,'2025-07-10 12:31:41'),
(76,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 972 menit. Denda: Rp2145','late',0,'2025-07-10 12:32:41'),
(77,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 973 menit. Denda: Rp2145','late',0,'2025-07-10 12:33:41'),
(78,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 974 menit. Denda: Rp2145','late',0,'2025-07-10 12:34:41'),
(79,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 975 menit. Denda: Rp2145','late',0,'2025-07-10 12:35:41'),
(80,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 976 menit. Denda: Rp2156','late',0,'2025-07-10 12:36:41'),
(81,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 977 menit. Denda: Rp2156','late',0,'2025-07-10 12:37:41'),
(82,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 978 menit. Denda: Rp2156','late',0,'2025-07-10 12:38:41'),
(83,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 979 menit. Denda: Rp2156','late',0,'2025-07-10 12:39:41'),
(84,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 980 menit. Denda: Rp2156','late',0,'2025-07-10 12:40:41'),
(85,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 981 menit. Denda: Rp2167','late',0,'2025-07-10 12:41:41'),
(86,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 982 menit. Denda: Rp2167','late',0,'2025-07-10 12:42:41'),
(87,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 983 menit. Denda: Rp2167','late',0,'2025-07-10 12:43:41'),
(88,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 984 menit. Denda: Rp2167','late',0,'2025-07-10 12:44:41'),
(89,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 985 menit. Denda: Rp2167','late',0,'2025-07-10 12:45:41'),
(90,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 986 menit. Denda: Rp2178','late',0,'2025-07-10 12:46:41'),
(91,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 987 menit. Denda: Rp2178','late',0,'2025-07-10 12:47:41'),
(92,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 988 menit. Denda: Rp2178','late',0,'2025-07-10 12:48:41'),
(93,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 989 menit. Denda: Rp2178','late',0,'2025-07-10 12:49:41'),
(94,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 990 menit. Denda: Rp2178','late',0,'2025-07-10 12:50:41'),
(95,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 991 menit. Denda: Rp2189','late',0,'2025-07-10 12:51:41'),
(96,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 992 menit. Denda: Rp2189','late',0,'2025-07-10 12:52:41'),
(97,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 993 menit. Denda: Rp2189','late',0,'2025-07-10 12:53:41'),
(98,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 994 menit. Denda: Rp2189','late',0,'2025-07-10 12:54:41'),
(99,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 995 menit. Denda: Rp2189','late',0,'2025-07-10 12:55:41'),
(100,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 996 menit. Denda: Rp2200','late',0,'2025-07-10 12:56:41'),
(101,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 997 menit. Denda: Rp2200','late',0,'2025-07-10 12:57:41'),
(102,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 998 menit. Denda: Rp2200','late',0,'2025-07-10 12:58:41'),
(103,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 1000 menit. Denda: Rp2200','late',0,'2025-07-10 13:01:01'),
(104,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 1001 menit. Denda: Rp2211','late',0,'2025-07-10 13:02:01'),
(105,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 1002 menit. Denda: Rp2211','late',0,'2025-07-10 13:03:01'),
(106,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 1003 menit. Denda: Rp2211','late',0,'2025-07-10 13:04:01'),
(107,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 1004 menit. Denda: Rp2211','late',0,'2025-07-10 13:05:01'),
(108,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 1008 menit. Denda: Rp2222','late',0,'2025-07-10 13:08:42'),
(109,16,96,'Denda Keterlambatan','Anda terlambat mengembalikan qq selama 1009 menit. Denda: Rp2222','late',0,'2025-07-10 13:09:42');

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
  `status` enum('tersedia','disewa','rusak','hilang') NOT NULL DEFAULT 'tersedia',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `products` */

insert  into `products`(`id`,`category_id`,`name`,`image`,`description`,`price`,`stock`,`status`,`created_at`) values 
(8,8,'bike','uploads/products/1747363751148-467040440.jpg','bagus',20000.00,36,'tersedia','2025-05-01 19:06:00'),
(17,8,'qq','uploads/products/1752025720378-602022416.jpg','qq',11.00,18,'tersedia','2025-05-08 22:18:24');

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
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `rentals` */

insert  into `rentals`(`id`,`product_id`,`user_id`,`customer_name`,`rental_hours`,`start_time`,`end_time`,`total_amount`,`penalty_amount`,`damage_penalty`,`lost_penalty`,`status`,`return_time`,`damage_notes`,`damage_proof`,`created_at`,`payment_status`,`payment_token`,`payment_url`,`payment_method`,`penalty_payment_status`,`penalty_payment_token`,`penalty_payment_url`) values 
(96,17,16,'frank',1,'2025-07-09 19:20:20','2025-07-09 20:20:20',11.00,2222.00,0.00,0.00,'playing',NULL,NULL,NULL,'2025-07-09 19:43:19','paid','f2c7aa87-a01c-42e9-8b31-3dbb5d90e60d','https://app.sandbox.midtrans.com/snap/v4/redirection/f2c7aa87-a01c-42e9-8b31-3dbb5d90e60d','gopay','paid','026eb9a3-d88b-4592-a828-b14c1b4ee647','https://app.sandbox.midtrans.com/snap/v4/redirection/026eb9a3-d88b-4592-a828-b14c1b4ee647');

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
