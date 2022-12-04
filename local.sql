-- MySQL dump 10.13  Distrib 8.0.27, for Linux (x86_64)
--
-- Host: localhost    Database: local
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
-- Table structure for table `fixtures`
--

DROP TABLE IF EXISTS `fixtures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fixtures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `home_team_id` int NOT NULL,
  `away_team_id` int NOT NULL,
  `home_team_score` int NOT NULL DEFAULT '0',
  `away_team_score` int NOT NULL DEFAULT '0',
  `begun_at` datetime NOT NULL,
  `ended_at` datetime NOT NULL,
  `tournament_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_78a061e2c8ff7fbe48477cc1d5` (`created_at`),
  KEY `IDX_475c3fc82be6d87559ab653367` (`updated_at`),
  KEY `IDX_b1ef4653619c4f8c8844d1a1a5` (`deleted_at`),
  KEY `IDX_21ca62c2e0f11afecc42b61b31` (`begun_at`),
  KEY `IDX_9099d1a5e24c9a022aff9e41f0` (`ended_at`),
  KEY `FK_67178c81d6df427c32d5cb9be1a` (`home_team_id`),
  KEY `FK_11f1afdc843168c6b3e5865700c` (`away_team_id`),
  CONSTRAINT `FK_11f1afdc843168c6b3e5865700c` FOREIGN KEY (`away_team_id`) REFERENCES `teams` (`id`),
  CONSTRAINT `FK_67178c81d6df427c32d5cb9be1a` FOREIGN KEY (`home_team_id`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fixtures`
--

LOCK TABLES `fixtures` WRITE;
/*!40000 ALTER TABLE `fixtures` DISABLE KEYS */;
INSERT INTO `fixtures` VALUES (1,'2022-12-03 15:11:44.248874','2022-12-04 10:55:59.000000','2022-12-04 17:56:00',1,2,2,6,'2022-12-10 17:30:00','2022-12-10 19:30:00','World cup'),(2,'2022-12-03 15:54:03.937152','2022-12-03 15:54:03.937152',NULL,4,5,0,0,'2022-12-12 17:30:00','2022-12-12 19:30:00','World cup'),(3,'2022-12-03 15:54:33.983513','2022-12-03 15:54:33.983513',NULL,6,7,0,0,'2022-12-14 17:30:00','2022-12-14 19:30:00','World cup'),(4,'2022-12-03 18:43:39.688000','2022-12-03 18:43:39.688000',NULL,8,7,0,0,'2022-12-16 17:30:00','2022-12-16 19:30:00','World cup'),(5,'2022-12-04 10:54:13.359227','2022-12-04 10:54:13.359227',NULL,8,9,0,0,'2022-12-17 17:30:00','2022-12-17 19:30:00','World cup');
/*!40000 ALTER TABLE `fixtures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon_image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_48c0c32e6247a2de155baeaf98` (`name`),
  KEY `IDX_9dbf2f9eb500fa2608fdf35a3d` (`created_at`),
  KEY `IDX_3a233036e6ef4e93f3b9218247` (`updated_at`),
  KEY `IDX_15ee861db0f704eb270acca390` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,'2022-12-03 12:21:39.945319','2022-12-04 10:53:35.544107',NULL,'liverpool','Liverpool edited 2','https://kgo.googleusercontent.com/profile_vrt_raw_bytes_1587515361_10542.jpg'),(2,'2022-12-03 14:04:10.356656','2022-12-03 14:04:10.356656',NULL,'machester-united','Manchester United','https://upload.wikimedia.org/wikipedia/vi/thumb/a/a1/Man_Utd_FC_.svg/1200px-Man_Utd_FC_.svg.png'),(4,'2022-12-03 14:06:29.287732','2022-12-03 14:06:29.287732',NULL,'barcelona','Barcelona','https://upload.wikimedia.org/wikipedia/vi/thumb/9/91/FC_Barcelona_logo.svg/1200px-FC_Barcelona_logo.svg.png'),(5,'2022-12-03 14:06:57.173121','2022-12-03 14:06:57.173121',NULL,'manchester-city','Manchester CIty','https://upload.wikimedia.org/wikipedia/vi/1/1d/Manchester_City_FC_logo.svg'),(6,'2022-12-03 14:08:07.674318','2022-12-03 14:08:07.674318',NULL,'chelsea','Chelsea','https://upload.wikimedia.org/wikipedia/vi/thumb/5/5c/Chelsea_crest.svg/1200px-Chelsea_crest.svg.png'),(7,'2022-12-03 14:08:42.181550','2022-12-03 14:08:42.181550',NULL,'real-madrid','Real Madrid','https://upload.wikimedia.org/wikipedia/vi/thumb/c/c7/Logo_Real_Madrid.svg/1200px-Logo_Real_Madrid.svg.png'),(8,'2022-12-03 15:56:51.373151','2022-12-03 15:56:51.373151',NULL,'pairis-saint-germain','Paris Saint Germain','https://upload.wikimedia.org/wikipedia/vi/a/a7/Paris_Saint-Germain_F.C..svg'),(9,'2022-12-04 10:52:23.452861','2022-12-04 10:52:23.452861',NULL,'pairis-saint-germain2','Paris Saint Germain2','https://upload.wikimedia.org/wikipedia/vi/a/a7/Paris_Saint-Germain_F.C..svg');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-04 18:06:43
