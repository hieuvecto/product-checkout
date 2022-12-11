-- MySQL dump 10.13  Distrib 8.0.31, for macos12 (x86_64)
--
-- Host: 127.0.0.1    Database: local
-- ------------------------------------------------------
-- Server version	8.0.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `checkout_items`
--

DROP TABLE IF EXISTS `checkout_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkout_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `checkout_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_31b6709e87350feab459107555` (`created_at`),
  KEY `IDX_f9b5f544ce4cb42f5b41cd617e` (`updated_at`),
  KEY `IDX_a755fdfc59cd57cddaa726de94` (`deleted_at`),
  KEY `FK_760f2c99d498239fb84120aa81e` (`checkout_id`),
  KEY `FK_8ef735ed236aa1f618b5bc78f56` (`item_id`),
  CONSTRAINT `FK_760f2c99d498239fb84120aa81e` FOREIGN KEY (`checkout_id`) REFERENCES `checkouts` (`id`),
  CONSTRAINT `FK_8ef735ed236aa1f618b5bc78f56` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkout_items`
--

LOCK TABLES `checkout_items` WRITE;
/*!40000 ALTER TABLE `checkout_items` DISABLE KEYS */;
INSERT INTO `checkout_items` VALUES (1,'2022-12-11 11:15:05.951305','2022-12-11 11:15:05.951305',NULL,2,1,1),(2,'2022-12-11 11:15:05.962178','2022-12-11 11:15:05.962178',NULL,2,2,1),(3,'2022-12-11 11:15:05.969752','2022-12-11 11:15:05.969752',NULL,2,3,1),(4,'2022-12-11 11:29:26.018317','2022-12-11 11:29:26.018317',NULL,3,1,1),(5,'2022-12-11 11:29:26.051268','2022-12-11 11:29:26.051268',NULL,3,2,1),(6,'2022-12-11 11:29:26.060698','2022-12-11 11:29:26.060698',NULL,3,3,2),(7,'2022-12-11 11:35:27.080976','2022-12-11 11:35:27.080976',NULL,4,1,1),(8,'2022-12-11 11:35:27.091664','2022-12-11 11:35:27.091664',NULL,4,2,1),(9,'2022-12-11 11:35:27.102043','2022-12-11 11:35:27.102043',NULL,4,3,2),(10,'2022-12-11 13:04:54.179684','2022-12-11 13:04:54.179684',NULL,5,1,2),(11,'2022-12-11 13:04:54.246496','2022-12-11 13:04:54.246496',NULL,5,2,1),(12,'2022-12-11 13:04:54.259467','2022-12-11 13:04:54.259467',NULL,5,3,2),(13,'2022-12-11 13:11:38.445378','2022-12-11 13:11:38.445378',NULL,6,1,3),(14,'2022-12-11 13:11:38.473026','2022-12-11 13:11:38.473026',NULL,6,3,1),(15,'2022-12-11 13:20:03.880683','2022-12-11 13:20:03.880683',NULL,7,1,3),(16,'2022-12-11 13:20:03.902489','2022-12-11 13:20:03.902489',NULL,7,3,1),(17,'2022-12-11 13:21:24.549555','2022-12-11 13:21:24.549555',NULL,8,1,3),(18,'2022-12-11 13:21:24.569794','2022-12-11 13:21:24.569794',NULL,8,3,1),(19,'2022-12-11 13:28:44.793033','2022-12-11 13:28:44.793033',NULL,9,2,3),(20,'2022-12-11 13:28:44.803771','2022-12-11 13:28:44.803771',NULL,9,3,1),(21,'2022-12-11 18:39:14.546641','2022-12-11 18:39:14.546641',NULL,10,1,1),(22,'2022-12-11 18:39:14.677757','2022-12-11 18:39:14.677757',NULL,10,2,1),(23,'2022-12-11 18:39:14.686994','2022-12-11 18:39:14.686994',NULL,10,3,1),(24,'2022-12-11 18:41:31.237679','2022-12-11 18:41:31.237679',NULL,11,1,3),(25,'2022-12-11 18:41:31.248913','2022-12-11 18:41:31.248913',NULL,11,3,1),(26,'2022-12-11 18:43:42.142306','2022-12-11 18:43:42.142306',NULL,12,2,3),(27,'2022-12-11 18:43:42.159275','2022-12-11 18:43:42.159275',NULL,12,3,1),(28,'2022-12-11 18:45:20.421868','2022-12-11 18:45:20.421868',NULL,13,2,3),(29,'2022-12-11 18:45:20.435518','2022-12-11 18:45:20.435518',NULL,13,3,1),(30,'2022-12-11 18:46:05.185586','2022-12-11 18:46:05.185586',NULL,14,2,2),(31,'2022-12-11 18:46:05.196967','2022-12-11 18:46:05.196967',NULL,14,3,1),(32,'2022-12-11 18:47:43.156644','2022-12-11 18:47:43.156644',NULL,15,1,1),(33,'2022-12-11 18:47:43.167085','2022-12-11 18:47:43.167085',NULL,15,3,1),(34,'2022-12-11 18:48:10.481689','2022-12-11 18:48:10.481689',NULL,16,1,2),(35,'2022-12-11 18:48:10.493191','2022-12-11 18:48:10.493191',NULL,16,3,1),(36,'2022-12-11 18:49:08.247396','2022-12-11 18:49:08.247396',NULL,17,1,6),(37,'2022-12-11 18:49:08.263211','2022-12-11 18:49:08.263211',NULL,17,3,2),(38,'2022-12-11 18:50:09.785043','2022-12-11 18:50:09.785043',NULL,18,1,8),(39,'2022-12-11 18:50:09.807359','2022-12-11 18:50:09.807359',NULL,18,3,2);
/*!40000 ALTER TABLE `checkout_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checkouts`
--

DROP TABLE IF EXISTS `checkouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkouts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `customer_id` int NOT NULL,
  `total_value` decimal(16,0) NOT NULL,
  `status` enum('unpaid','paid','confirmed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `paid_at` datetime DEFAULT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `discounted_value` decimal(16,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_6de7d590e66ee65644217c9e3f` (`created_at`),
  KEY `IDX_90622a94a7492ac778b367ba2a` (`updated_at`),
  KEY `IDX_5f160efb3e209ea23eae22d479` (`deleted_at`),
  KEY `IDX_4e902f73b6cc752ec11026134c` (`total_value`),
  KEY `IDX_e122b4131eba90a0becaa0e3b9` (`status`),
  KEY `IDX_018365ce3faba210341b42f8c9` (`paid_at`),
  KEY `IDX_118df31212a11f0efcce97c16b` (`confirmed_at`),
  KEY `FK_085b53031b032b8daa84e9a6d06` (`customer_id`),
  KEY `IDX_ac3fe5368134a18c5b6f1b4f92` (`discounted_value`),
  CONSTRAINT `FK_085b53031b032b8daa84e9a6d06` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkouts`
--

LOCK TABLES `checkouts` WRITE;
/*!40000 ALTER TABLE `checkouts` DISABLE KEYS */;
INSERT INTO `checkouts` VALUES (1,'2022-12-11 11:10:05.116786','2022-12-11 11:14:47.085127','2022-12-11 11:10:05',2,4997,'unpaid',NULL,NULL,0),(2,'2022-12-11 11:15:05.932182','2022-12-11 18:30:56.424742','2022-12-11 11:10:05',2,4997,'cancelled',NULL,NULL,0),(3,'2022-12-11 11:29:25.952622','2022-12-11 11:35:11.911824','2022-12-11 11:10:05',2,4997,'unpaid',NULL,NULL,0),(4,'2022-12-11 11:35:27.045419','2022-12-11 18:30:56.627356','2022-12-11 11:10:05',2,7196,'confirmed','2022-12-11 18:53:31','2022-12-11 18:54:53',0),(5,'2022-12-11 13:04:54.130060','2022-12-11 18:30:56.653603','2022-12-11 11:10:05',2,8395,'unpaid',NULL,NULL,0),(6,'2022-12-11 13:11:38.389787','2022-12-11 18:30:56.662393','2022-12-11 11:10:05',2,4597,'unpaid',NULL,NULL,0),(7,'2022-12-11 13:20:03.789632','2022-12-11 18:30:56.671888','2022-12-11 11:10:05',2,5796,'unpaid',NULL,NULL,4597),(8,'2022-12-11 13:21:24.492773','2022-12-11 18:30:56.707566','2022-12-11 11:10:05',2,5796,'unpaid',NULL,NULL,4597),(9,'2022-12-11 13:28:44.735566','2022-12-11 18:30:56.718768','2022-12-11 11:10:05',3,6996,'unpaid',NULL,NULL,6796),(10,'2022-12-11 18:39:14.474323','2022-12-11 18:39:14.474323',NULL,1,4997,'unpaid',NULL,NULL,4997),(11,'2022-12-11 18:41:31.198507','2022-12-11 18:41:31.198507',NULL,2,5796,'unpaid',NULL,NULL,4597),(12,'2022-12-11 18:43:42.090919','2022-12-11 18:43:42.090919',NULL,3,6996,'unpaid',NULL,NULL,6796),(13,'2022-12-11 18:45:20.401355','2022-12-11 18:45:20.401355',NULL,4,6996,'unpaid',NULL,NULL,6996),(14,'2022-12-11 18:46:05.165048','2022-12-11 18:46:05.165048',NULL,3,5397,'unpaid',NULL,NULL,5197),(15,'2022-12-11 18:47:43.138477','2022-12-11 18:47:43.138477',NULL,3,3398,'unpaid',NULL,NULL,3198),(16,'2022-12-11 18:48:10.464614','2022-12-11 18:48:10.464614',NULL,3,4597,'unpaid',NULL,NULL,4397),(17,'2022-12-11 18:49:08.234678','2022-12-11 18:57:55.000000',NULL,3,11592,'cancelled',NULL,NULL,8794),(18,'2022-12-11 18:50:09.753579','2022-12-11 18:57:26.000000',NULL,3,13990,'confirmed','2022-12-12 01:56:55','2022-12-12 01:57:27',11192);
/*!40000 ALTER TABLE `checkouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checkouts_pricing_rules`
--

DROP TABLE IF EXISTS `checkouts_pricing_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkouts_pricing_rules` (
  `checkout_id` int NOT NULL,
  `pricing_rule_id` int NOT NULL,
  PRIMARY KEY (`checkout_id`,`pricing_rule_id`),
  KEY `IDX_8edc1b344875baf1041115e79f` (`checkout_id`),
  KEY `IDX_2d59c56bb77643b534c1b74504` (`pricing_rule_id`),
  CONSTRAINT `FK_2d59c56bb77643b534c1b745042` FOREIGN KEY (`pricing_rule_id`) REFERENCES `pricing_rules` (`id`),
  CONSTRAINT `FK_8edc1b344875baf1041115e79f1` FOREIGN KEY (`checkout_id`) REFERENCES `checkouts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkouts_pricing_rules`
--

LOCK TABLES `checkouts_pricing_rules` WRITE;
/*!40000 ALTER TABLE `checkouts_pricing_rules` DISABLE KEYS */;
INSERT INTO `checkouts_pricing_rules` VALUES (11,1),(12,2),(12,5),(13,4),(14,2),(14,5),(15,2),(15,5),(16,2),(16,5),(17,2),(17,5),(18,2),(18,5);
/*!40000 ALTER TABLE `checkouts_pricing_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon_image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('default','privileged') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_b942d55b92ededa770041db9de` (`name`),
  KEY `IDX_a8fcf679692db1c886e7f15d2b` (`created_at`),
  KEY `IDX_386a5e03676dab6b7bf4bf020b` (`updated_at`),
  KEY `IDX_99cd55dbbe025d3efd696597d8` (`deleted_at`),
  KEY `IDX_dd44f67433aadad2785aecd5be` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'2022-12-11 09:18:42.120645','2022-12-11 09:29:09.347179',NULL,'default','Default','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz1K1evWjMTfR3IMBxQxXSGV2pTaO2rAP7EzIMB4u0YwxfFL4pJ269eff6sNvuxtjI7c4&usqp=CAU','default'),(2,'2022-12-11 09:13:08.486539','2022-12-11 18:35:13.893231',NULL,'microsoft','Microsoft','https://avatars.githubusercontent.com/u/6154722?s=280&v=4','privileged'),(3,'2022-12-11 09:19:51.781852','2022-12-11 09:19:51.781852',NULL,'amazon','Amazon','https://znews-stc.zdn.vn/static/topic/company/amazon.png','privileged'),(4,'2022-12-11 09:20:18.837128','2022-12-11 09:20:18.837128',NULL,'facebook','Facebook','https://www.facebook.com/images/fb_icon_325x325.png','privileged'),(11,'2022-12-11 18:36:34.090343','2022-12-11 18:36:34.090343',NULL,'netflix','Netflix','http://store-images.s-microsoft.com/image/apps.46851.9007199266246365.1f6d0339-ecce-4fe5-840a-652cd84111ad.ddef6be7-6304-41c0-a347-1d571b66dfb2','privileged'),(12,'2022-12-11 18:37:19.022332','2022-12-11 18:37:19.022332',NULL,'netflix2','Netflix number 2','http://store-images.s-microsoft.com/image/apps.46851.9007199266246365.1f6d0339-ecce-4fe5-840a-652cd84111ad.ddef6be7-6304-41c0-a347-1d571b66dfb2','privileged');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `title` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(16,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_02c9c7f4f86c3628ba6ec2e02b` (`created_at`),
  KEY `IDX_e43a64f27096177120d2e05cf6` (`updated_at`),
  KEY `IDX_ce829a3d8c90376de8d3a02df7` (`deleted_at`),
  KEY `IDX_50ce9fb68ba90baa6c552a9cb5` (`price`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'2022-12-11 09:26:12.537349','2022-12-11 09:27:09.175398',NULL,'Small Pizza','10\'\' pizza for one person',1199),(2,'2022-12-11 09:26:38.815884','2022-12-11 09:27:09.195574',NULL,'Medium Pizza','12\'\' Pizza for two persons',1599),(3,'2022-12-11 09:27:36.557597','2022-12-11 09:27:36.557597',NULL,'Large Pizza','15\'\' Pizza for four persons',2199);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pricing_rules`
--

DROP TABLE IF EXISTS `pricing_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pricing_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `customer_id` int NOT NULL,
  `item_id` int NOT NULL,
  `type` enum('deal','discount') COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_quantity` int DEFAULT NULL,
  `to_quantity` int DEFAULT NULL,
  `discount_price` decimal(16,0) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_c67ce9dbecf0e7f2009f4a895a` (`customer_id`,`item_id`),
  KEY `IDX_f0a6478ed27c2a86abb63537c3` (`created_at`),
  KEY `IDX_6a9c429a3b38985471aa61bf48` (`updated_at`),
  KEY `IDX_5dc7bb9bbc21983bd4dd8f4f55` (`deleted_at`),
  KEY `FK_82cee25dbcb87b10841a6056b68` (`item_id`),
  CONSTRAINT `FK_06a0be2aebfaaf206861a55c2cf` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FK_82cee25dbcb87b10841a6056b68` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pricing_rules`
--

LOCK TABLES `pricing_rules` WRITE;
/*!40000 ALTER TABLE `pricing_rules` DISABLE KEYS */;
INSERT INTO `pricing_rules` VALUES (1,'2022-12-11 13:37:12.629257','2022-12-11 13:37:12.629257',NULL,2,1,'deal',3,2,NULL),(2,'2022-12-11 13:37:12.665659','2022-12-11 17:22:33.779226',NULL,3,3,'discount',NULL,NULL,1999),(4,'2022-12-11 13:47:49.815484','2022-12-11 13:47:49.815484',NULL,4,2,'deal',5,4,NULL),(5,'2022-12-11 18:31:50.117205','2022-12-11 18:31:50.117205',NULL,3,1,'deal',3,2,NULL);
/*!40000 ALTER TABLE `pricing_rules` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-12  1:59:51
