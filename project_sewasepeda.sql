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
) ENGINE=InnoDB AUTO_INCREMENT=624 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `notifications` */

insert  into `notifications`(`id`,`user_id`,`rental_id`,`title`,`message`,`type`,`is_read`,`created_at`) values 
(497,12,102,'Denda Keterlambatan','Anda terlambat mengembalikan bike selama 8507 menit. Denda: Rp8507000','late',1,'2025-07-16 19:31:59'),
(498,12,102,'Denda Keterlambatan','Anda terlambat mengembalikan bike selama 8508 menit. Denda: Rp8508000','late',1,'2025-07-16 19:32:59'),
(499,12,102,'Denda Keterlambatan','Anda terlambat mengembalikan bike selama 8509 menit. Denda: Rp8509000','late',1,'2025-07-16 19:33:59'),
(500,12,102,'Denda Keterlambatan','Anda terlambat mengembalikan bike selama 8510 menit. Denda: Rp8510000','late',1,'2025-07-16 19:34:59'),
(501,12,102,'Denda Rental','Anda memiliki denda: \nKeterlambatan: Rp8512000','late',1,'2025-07-16 19:35:33'),
(502,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 4 menit. Denda: Rp4000','late',1,'2025-07-16 20:18:50'),
(503,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 5 menit. Denda: Rp5000','late',1,'2025-07-16 20:19:50'),
(504,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 6 menit. Denda: Rp6000','late',1,'2025-07-16 20:20:50'),
(505,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 7 menit. Denda: Rp7000','late',1,'2025-07-16 20:21:50'),
(506,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 8 menit. Denda: Rp8000','late',0,'2025-07-16 20:22:50'),
(507,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9 menit. Denda: Rp9000','late',0,'2025-07-16 20:23:50'),
(508,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9464 menit. Denda: Rp9464000','late',0,'2025-07-23 09:58:40'),
(509,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9465 menit. Denda: Rp9465000','late',0,'2025-07-23 09:59:39'),
(510,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9466 menit. Denda: Rp9466000','late',0,'2025-07-23 10:00:39'),
(511,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9467 menit. Denda: Rp9467000','late',0,'2025-07-23 10:01:39'),
(512,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9468 menit. Denda: Rp9468000','late',0,'2025-07-23 10:02:39'),
(513,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9469 menit. Denda: Rp9469000','late',0,'2025-07-23 10:03:39'),
(514,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9470 menit. Denda: Rp9470000','late',0,'2025-07-23 10:04:39'),
(515,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9471 menit. Denda: Rp9471000','late',0,'2025-07-23 10:05:39'),
(516,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9472 menit. Denda: Rp9472000','late',0,'2025-07-23 10:06:39'),
(517,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9473 menit. Denda: Rp9473000','late',0,'2025-07-23 10:07:39'),
(518,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9474 menit. Denda: Rp9474000','late',0,'2025-07-23 10:08:39'),
(519,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9475 menit. Denda: Rp9475000','late',0,'2025-07-23 10:09:39'),
(520,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9476 menit. Denda: Rp9476000','late',0,'2025-07-23 10:10:39'),
(521,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9477 menit. Denda: Rp9477000','late',0,'2025-07-23 10:11:39'),
(522,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9478 menit. Denda: Rp9478000','late',0,'2025-07-23 10:12:39'),
(523,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9479 menit. Denda: Rp9479000','late',0,'2025-07-23 10:13:39'),
(524,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9480 menit. Denda: Rp9480000','late',0,'2025-07-23 10:14:39'),
(525,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9481 menit. Denda: Rp9481000','late',0,'2025-07-23 10:15:39'),
(526,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9482 menit. Denda: Rp9482000','late',0,'2025-07-23 10:16:39'),
(527,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9483 menit. Denda: Rp9483000','late',0,'2025-07-23 10:17:39'),
(528,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9484 menit. Denda: Rp9484000','late',0,'2025-07-23 10:18:39'),
(529,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9485 menit. Denda: Rp9485000','late',0,'2025-07-23 10:19:39'),
(530,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9486 menit. Denda: Rp9486000','late',0,'2025-07-23 10:20:39'),
(531,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9487 menit. Denda: Rp9487000','late',0,'2025-07-23 10:21:39'),
(532,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9488 menit. Denda: Rp9488000','late',0,'2025-07-23 10:22:39'),
(533,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9489 menit. Denda: Rp9489000','late',0,'2025-07-23 10:23:39'),
(534,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9490 menit. Denda: Rp9490000','late',0,'2025-07-23 10:24:39'),
(535,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9491 menit. Denda: Rp9491000','late',0,'2025-07-23 10:25:39'),
(536,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9492 menit. Denda: Rp9492000','late',0,'2025-07-23 10:26:39'),
(537,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9493 menit. Denda: Rp9493000','late',0,'2025-07-23 10:27:39'),
(538,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9494 menit. Denda: Rp9494000','late',0,'2025-07-23 10:28:39'),
(539,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9495 menit. Denda: Rp9495000','late',0,'2025-07-23 10:29:39'),
(540,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9496 menit. Denda: Rp9496000','late',0,'2025-07-23 10:30:39'),
(541,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9497 menit. Denda: Rp9497000','late',0,'2025-07-23 10:31:39'),
(542,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9498 menit. Denda: Rp9498000','late',0,'2025-07-23 10:32:39'),
(543,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9499 menit. Denda: Rp9499000','late',0,'2025-07-23 10:33:39'),
(544,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9500 menit. Denda: Rp9500000','late',0,'2025-07-23 10:34:39'),
(545,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9501 menit. Denda: Rp9501000','late',0,'2025-07-23 10:35:39'),
(546,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9502 menit. Denda: Rp9502000','late',0,'2025-07-23 10:36:39'),
(547,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9503 menit. Denda: Rp9503000','late',0,'2025-07-23 10:37:39'),
(548,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9504 menit. Denda: Rp9504000','late',0,'2025-07-23 10:38:39'),
(549,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 9505 menit. Denda: Rp9505000','late',0,'2025-07-23 10:39:39'),
(550,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17029 menit. Denda: Rp17029000','late',0,'2025-07-28 16:03:56'),
(551,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17030 menit. Denda: Rp17030000','late',0,'2025-07-28 16:04:56'),
(552,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17031 menit. Denda: Rp17031000','late',0,'2025-07-28 16:05:56'),
(553,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17032 menit. Denda: Rp17032000','late',0,'2025-07-28 16:06:56'),
(554,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17314 menit. Denda: Rp17314000','late',0,'2025-07-28 20:48:47'),
(555,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17315 menit. Denda: Rp17315000','late',0,'2025-07-28 20:49:46'),
(556,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17316 menit. Denda: Rp17316000','late',0,'2025-07-28 20:50:47'),
(557,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17317 menit. Denda: Rp17317000','late',0,'2025-07-28 20:51:46'),
(558,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17318 menit. Denda: Rp17318000','late',0,'2025-07-28 20:52:46'),
(559,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17319 menit. Denda: Rp17319000','late',0,'2025-07-28 20:53:46'),
(560,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17320 menit. Denda: Rp17320000','late',0,'2025-07-28 20:54:46'),
(561,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17321 menit. Denda: Rp17321000','late',0,'2025-07-28 20:55:46'),
(562,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17322 menit. Denda: Rp17322000','late',0,'2025-07-28 20:56:46'),
(563,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17323 menit. Denda: Rp17323000','late',0,'2025-07-28 20:57:47'),
(564,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17324 menit. Denda: Rp17324000','late',0,'2025-07-28 20:58:47'),
(565,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17325 menit. Denda: Rp17325000','late',0,'2025-07-28 20:59:47'),
(566,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17326 menit. Denda: Rp17326000','late',0,'2025-07-28 21:00:47'),
(567,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17327 menit. Denda: Rp17327000','late',0,'2025-07-28 21:01:47'),
(568,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17328 menit. Denda: Rp17328000','late',0,'2025-07-28 21:02:47'),
(569,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17329 menit. Denda: Rp17329000','late',0,'2025-07-28 21:03:47'),
(570,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17330 menit. Denda: Rp17330000','late',1,'2025-07-28 21:04:47'),
(571,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17331 menit. Denda: Rp17331000','late',1,'2025-07-28 21:05:47'),
(572,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 17332 menit. Denda: Rp17332000','late',1,'2025-07-28 21:06:47'),
(573,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21505 menit. Denda: Rp21505000','late',1,'2025-07-31 18:39:42'),
(574,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21506 menit. Denda: Rp21506000','late',1,'2025-07-31 18:40:42'),
(575,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21507 menit. Denda: Rp21507000','late',1,'2025-07-31 18:41:42'),
(576,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21508 menit. Denda: Rp21508000','late',1,'2025-07-31 18:42:42'),
(577,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21509 menit. Denda: Rp21509000','late',1,'2025-07-31 18:43:42'),
(578,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21510 menit. Denda: Rp21510000','late',1,'2025-07-31 18:44:42'),
(579,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21511 menit. Denda: Rp21511000','late',1,'2025-07-31 18:45:42'),
(580,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21512 menit. Denda: Rp21512000','late',1,'2025-07-31 18:46:42'),
(581,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21513 menit. Denda: Rp21513000','late',1,'2025-07-31 18:47:42'),
(582,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21514 menit. Denda: Rp21514000','late',1,'2025-07-31 18:48:42'),
(583,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21515 menit. Denda: Rp21515000','late',1,'2025-07-31 18:49:42'),
(584,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21516 menit. Denda: Rp21516000','late',1,'2025-07-31 18:50:42'),
(585,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21517 menit. Denda: Rp21517000','late',1,'2025-07-31 18:51:42'),
(586,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21518 menit. Denda: Rp21518000','late',1,'2025-07-31 18:52:42'),
(587,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21519 menit. Denda: Rp21519000','late',1,'2025-07-31 18:53:42'),
(588,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21520 menit. Denda: Rp21520000','late',1,'2025-07-31 18:54:42'),
(589,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21521 menit. Denda: Rp21521000','late',1,'2025-07-31 18:55:42'),
(590,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21522 menit. Denda: Rp21522000','late',1,'2025-07-31 18:56:42'),
(591,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21523 menit. Denda: Rp21523000','late',1,'2025-07-31 18:57:42'),
(592,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21524 menit. Denda: Rp21524000','late',1,'2025-07-31 18:58:42'),
(593,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21525 menit. Denda: Rp21525000','late',1,'2025-07-31 18:59:42'),
(594,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21526 menit. Denda: Rp21526000','late',1,'2025-07-31 19:00:42'),
(595,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21527 menit. Denda: Rp21527000','late',1,'2025-07-31 19:01:42'),
(596,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21528 menit. Denda: Rp21528000','late',1,'2025-07-31 19:02:42'),
(597,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21529 menit. Denda: Rp21529000','late',1,'2025-07-31 19:03:43'),
(598,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21530 menit. Denda: Rp21530000','late',1,'2025-07-31 19:04:43'),
(599,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21531 menit. Denda: Rp21531000','late',1,'2025-07-31 19:05:43'),
(600,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21532 menit. Denda: Rp21532000','late',1,'2025-07-31 19:06:43'),
(601,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21533 menit. Denda: Rp21533000','late',1,'2025-07-31 19:07:43'),
(602,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21534 menit. Denda: Rp21534000','late',1,'2025-07-31 19:08:43'),
(603,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21535 menit. Denda: Rp21535000','late',1,'2025-07-31 19:09:43'),
(604,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21536 menit. Denda: Rp21536000','late',1,'2025-07-31 19:10:43'),
(605,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21537 menit. Denda: Rp21537000','late',1,'2025-07-31 19:11:43'),
(606,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21538 menit. Denda: Rp21538000','late',1,'2025-07-31 19:12:43'),
(607,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21539 menit. Denda: Rp21539000','late',1,'2025-07-31 19:13:43'),
(608,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21540 menit. Denda: Rp21540000','late',1,'2025-07-31 19:14:43'),
(609,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21541 menit. Denda: Rp21541000','late',1,'2025-07-31 19:15:43'),
(610,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21542 menit. Denda: Rp21542000','late',1,'2025-07-31 19:16:43'),
(611,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21543 menit. Denda: Rp21543000','late',1,'2025-07-31 19:17:43'),
(612,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21544 menit. Denda: Rp21544000','late',1,'2025-07-31 19:18:43'),
(613,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21545 menit. Denda: Rp21545000','late',1,'2025-07-31 19:19:43'),
(614,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21546 menit. Denda: Rp21546000','late',1,'2025-07-31 19:20:43'),
(615,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21547 menit. Denda: Rp21547000','late',1,'2025-07-31 19:21:43'),
(616,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21548 menit. Denda: Rp21548000','late',1,'2025-07-31 19:22:43'),
(617,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21549 menit. Denda: Rp21549000','late',1,'2025-07-31 19:23:43'),
(618,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21550 menit. Denda: Rp21550000','late',1,'2025-07-31 19:24:43'),
(619,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21551 menit. Denda: Rp21551000','late',1,'2025-07-31 19:25:43'),
(620,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21552 menit. Denda: Rp21552000','late',1,'2025-07-31 19:26:43'),
(621,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21553 menit. Denda: Rp21553000','late',1,'2025-07-31 19:27:43'),
(622,12,103,'Denda Keterlambatan','Anda terlambat mengembalikan sepeda selama 21554 menit. Denda: Rp21554000','late',1,'2025-07-31 19:28:43'),
(623,12,103,'Denda Rental','Anda memiliki denda: \nKeterlambatan: Rp21555000','late',1,'2025-07-31 19:29:07');

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
(18,8,'wasd','uploads/products/1753963839630-266537247.jpg','wasd',25000.00,12,11,0,1,0,'tersedia','2025-07-31 19:10:39','WASD-001'),
(20,9,'cobaa','uploads/products/1753971353925-749823863.jpg','wasdwasd',30000.00,12,11,0,0,0,'tersedia','2025-07-31 21:15:53',NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `rental_reports` */

insert  into `rental_reports`(`id`,`rental_id`,`report_type`,`amount`,`description`,`proof_image`,`created_at`) values 
(1,100,'late',143000.00,'Denda keterlambatan',NULL,'2025-07-10 19:20:26'),
(2,99,'late',310000.00,'Denda keterlambatan',NULL,'2025-07-10 21:31:28'),
(3,102,'late',8512000.00,'Denda keterlambatan',NULL,'2025-07-16 19:35:33'),
(4,103,'late',21555000.00,'Denda keterlambatan',NULL,'2025-07-31 19:29:07');

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
(106,20,12,'2',1,'2025-08-01 09:49:08','2025-08-01 10:49:08',30000.00,0.00,0.00,0.00,'playing',NULL,NULL,NULL,'2025-08-01 09:49:07','paid','916bc913-98d0-43d3-b962-b31333a2dd78','https://app.sandbox.midtrans.com/snap/v4/redirection/916bc913-98d0-43d3-b962-b31333a2dd78','gopay',NULL,NULL,NULL,'PRODUCT-20-1754016547591-594');

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
