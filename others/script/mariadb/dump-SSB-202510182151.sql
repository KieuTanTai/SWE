/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.0.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: SSB
-- ------------------------------------------------------
-- Server version	12.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Account`
--

DROP TABLE IF EXISTS `Account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Account` (
  `account_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_email` varchar(255) NOT NULL,
  `account_password` varchar(255) NOT NULL,
  `account_create_date` timestamp NULL DEFAULT current_timestamp(),
  `account_last_updated_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `account_login_status` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `account_email` (`account_email`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Account`
--

LOCK TABLES `Account` WRITE;
/*!40000 ALTER TABLE `Account` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Account` VALUES
(1,'superadmin@yourdomain.com','$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa','2025-10-18 13:46:27','2025-10-18 13:54:59',1),
(2,'admin1@yourdomain.com','$2b$04$6wF00E7wyf4kjiE5quGSy.2VdrjYgFV/IOxvz7yzanU5U2RzrQ0GC','2025-10-18 13:46:27','2025-10-18 13:54:59',1),
(3,'admin2@yourdomain.com','$2b$04$2HlQBltgAQ8jerW3F8qmFuI8Wx6SpYkM/IjrPIh7K3C4eYdzI0rFy','2025-10-18 13:46:27','2025-10-18 13:54:59',1),
(4,'manager1@yourdomain.com','$2b$04$6nBd2aGlhnPm6oSaliogjuyei0xmCzZ9PFqcM9XePWU3kB82P1rgW','2025-10-18 13:46:27','2025-10-18 13:54:59',1),
(5,'manager2@yourdomain.com','$2b$04$v1.Umg1oqcUCU9obYF1OKerE4azTQxzyLFG5A7xsfjCJDoWro9bsq','2025-10-18 13:46:27','2025-10-18 13:54:59',1),
(6,'parent1@gmail.com','$2b$04$LtY5.BcV/M.rsUc7dn5Viun6MsLLqEv.ym.k6F3neCs9RrJXkTSrW','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(7,'parent2@gmail.com','$2b$04$eYL/LeRpD3UUhlAGlSCOF.c.K5ACkkKiHnD71nlRj/om8AVZbMoYi','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(8,'parent3@gmail.com','$2b$04$h8P25g0F/t1cAZ4GKtOH7urxMri2i6fiK811aPjRnwVYeKEN/TgY6','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(9,'parent4@gmail.com','$2b$04$5nBL5c08uygk24EHz7DMCOitIkqQw4XKy8VRIEz20NhgQx468Vwcy','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(10,'parent5@gmail.com','$2b$04$2disRADm/pZA/Rk13yYBie9DuSPYmSJxLqgFFpwJNZFdj3C8awwV.','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(11,'parent6@gmail.com','$2b$04$rDVnHc1sgi.5LYw8mEp48.0yAH1UbnKkgpOCag4ypfuaeDRMME672','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(12,'parent7@gmail.com','$2b$04$8eOHPtZOwAVIANP58bOs0O/U1BvoqOkkhlKhXQKH0ZmGuO1Uk2DRm','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(13,'driver1@gmail.com','$2b$04$/u59I21lY4a.cKmrLJSLaORFlMtkVcI36zQgGyTULc2fDfPSIKeay','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(14,'driver2@gmail.com','$2b$04$8vovnW2uMJX.SmtodW80KOdeIBJJyDCuJlVFJhL1evlhQOEAZp7Hq','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(15,'driver3@gmail.com','$2b$04$x5Y3JBjEzdOsjKAH3UF9guayxD5eQxI.rkqbBVfB95nT4NXlLUe4u','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(16,'parent8@gmail.com','$2b$04$y7S71ZXlRr8NkRs5Kxmz9eLofqYny78/fLFc0TXj3RKC5DL.tpT8W','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(17,'parent9@gmail.com','$2b$04$44hx1RPhT.hlSC8TIqFs6O0YfhcpTB1i8HimxM/n7swubbQq2S6d.','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(18,'parent10@gmail.com','$2b$04$ZgA3zfWvzkzGqZS8AtHowuTBQ6EPef4HPvQjnKTke0R9dh.auRzzq','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(19,'driver4@gmail.com','$2b$04$AJ.eZmksYBZVunhiRWnOMOc7.VwxMC/.5plMX0nAhEjrOCVinZ4Ae','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(20,'driver5@gmail.com','$2b$04$EWFdwKoArpuyFR6ymG6hVe2hexARsSy6QyQRAs0/QqNsO8oyJCI7y','2025-10-18 13:46:27','2025-10-18 14:08:43',1),
(21,'accountant_001@yourdomain.com','$2b$04$MuqVFgweCYStxDgt5Tw2x.iPpzSgptocT.Rpx84k7hH7AHijah86u','2025-10-18 13:46:27','2025-10-18 13:54:59',1),
(22,'accountant_002@yourdomain.com','$2b$04$ntQ8j/j0wNJhKxWQTSu31O7tyL7cgCu6RVEreZnK3/nyPDGo6AIem','2025-10-18 13:46:27','2025-10-18 13:54:59',1);
/*!40000 ALTER TABLE `Account` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Account_Role`
--

DROP TABLE IF EXISTS `Account_Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Account_Role` (
  `role_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  PRIMARY KEY (`role_id`,`account_id`),
  KEY `fk_account_role_account` (`account_id`),
  CONSTRAINT `fk_account_role_account` FOREIGN KEY (`account_id`) REFERENCES `Account` (`account_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_account_role_role` FOREIGN KEY (`role_id`) REFERENCES `Role` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Account_Role`
--

LOCK TABLES `Account_Role` WRITE;
/*!40000 ALTER TABLE `Account_Role` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Account_Role` VALUES
(1,1),
(2,2),
(2,3),
(3,4),
(3,5),
(4,6),
(4,7),
(4,8),
(4,9),
(4,10),
(4,11),
(4,12),
(5,13),
(5,14),
(5,15),
(4,16),
(4,17),
(4,18),
(5,19),
(5,20);
/*!40000 ALTER TABLE `Account_Role` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Address`
--

DROP TABLE IF EXISTS `Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Address` (
  `address_id` int(11) NOT NULL AUTO_INCREMENT,
  `address_city_id` int(11) NOT NULL,
  `address_district_id` int(11) NOT NULL,
  `address_ward_id` int(11) NOT NULL,
  `address_number` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  KEY `fk_address_city` (`address_city_id`),
  KEY `fk_address_district` (`address_district_id`),
  KEY `fk_address_ward` (`address_ward_id`),
  CONSTRAINT `fk_address_city` FOREIGN KEY (`address_city_id`) REFERENCES `Location_City` (`location_city_id`),
  CONSTRAINT `fk_address_district` FOREIGN KEY (`address_district_id`) REFERENCES `Location_District` (`location_district_id`),
  CONSTRAINT `fk_address_ward` FOREIGN KEY (`address_ward_id`) REFERENCES `Location_Ward` (`location_ward_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Address`
--

LOCK TABLES `Address` WRITE;
/*!40000 ALTER TABLE `Address` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Address` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Bus`
--

DROP TABLE IF EXISTS `Bus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bus` (
  `bus_id` int(11) NOT NULL AUTO_INCREMENT,
  `bus_license_plate` varchar(20) NOT NULL,
  `bus_brand` varchar(50) DEFAULT NULL,
  `bus_model` varchar(50) DEFAULT NULL,
  `bus_capacity` int(11) NOT NULL,
  `bus_year_manufactured` int(11) DEFAULT NULL,
  `bus_has_wifi` tinyint(1) DEFAULT 0,
  `bus_has_camera` tinyint(1) DEFAULT 0,
  `bus_color` varchar(30) DEFAULT NULL,
  `bus_status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`bus_id`),
  UNIQUE KEY `bus_license_plate` (`bus_license_plate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bus`
--

LOCK TABLES `Bus` WRITE;
/*!40000 ALTER TABLE `Bus` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Bus` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Bus_Route`
--

DROP TABLE IF EXISTS `Bus_Route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bus_Route` (
  `bus_route_id` int(11) NOT NULL AUTO_INCREMENT,
  `route_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `bus_route_status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`bus_route_id`),
  KEY `fk_bus_route_route` (`route_id`),
  KEY `fk_bus_route_bus` (`bus_id`),
  CONSTRAINT `fk_bus_route_bus` FOREIGN KEY (`bus_id`) REFERENCES `Bus` (`bus_id`),
  CONSTRAINT `fk_bus_route_route` FOREIGN KEY (`route_id`) REFERENCES `Route` (`route_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bus_Route`
--

LOCK TABLES `Bus_Route` WRITE;
/*!40000 ALTER TABLE `Bus_Route` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Bus_Route` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Detail_Route`
--

DROP TABLE IF EXISTS `Detail_Route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Detail_Route` (
  `detail_route_id` int(11) NOT NULL AUTO_INCREMENT,
  `route_id` int(11) NOT NULL,
  `detail_route_start_point_id` int(11) NOT NULL,
  `detail_route_end_point_id` int(11) NOT NULL,
  `detail_route_distance` float DEFAULT NULL,
  PRIMARY KEY (`detail_route_id`),
  KEY `fk_detail_route_route` (`route_id`),
  KEY `fk_detail_route_start` (`detail_route_start_point_id`),
  KEY `fk_detail_route_end` (`detail_route_end_point_id`),
  CONSTRAINT `fk_detail_route_end` FOREIGN KEY (`detail_route_end_point_id`) REFERENCES `Address` (`address_id`),
  CONSTRAINT `fk_detail_route_route` FOREIGN KEY (`route_id`) REFERENCES `Route` (`route_id`),
  CONSTRAINT `fk_detail_route_start` FOREIGN KEY (`detail_route_start_point_id`) REFERENCES `Address` (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Detail_Route`
--

LOCK TABLES `Detail_Route` WRITE;
/*!40000 ALTER TABLE `Detail_Route` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Detail_Route` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Detail_Schedule`
--

DROP TABLE IF EXISTS `Detail_Schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Detail_Schedule` (
  `detail_schedule_id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_id` int(11) NOT NULL,
  `detail_schedule_bus_route_id` int(11) NOT NULL,
  `detail_schedule_time_role_id` int(11) NOT NULL,
  PRIMARY KEY (`detail_schedule_id`),
  KEY `fk_detail_schedule_schedule` (`schedule_id`),
  KEY `fk_detail_schedule_time_role` (`detail_schedule_time_role_id`),
  KEY `fk_detail_schedule_bus_route` (`detail_schedule_bus_route_id`),
  CONSTRAINT `fk_detail_schedule_bus_route` FOREIGN KEY (`detail_schedule_bus_route_id`) REFERENCES `Bus_Route` (`bus_route_id`),
  CONSTRAINT `fk_detail_schedule_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `Schedule` (`schedule_id`),
  CONSTRAINT `fk_detail_schedule_time_role` FOREIGN KEY (`detail_schedule_time_role_id`) REFERENCES `Time_Role` (`time_role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Detail_Schedule`
--

LOCK TABLES `Detail_Schedule` WRITE;
/*!40000 ALTER TABLE `Detail_Schedule` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Detail_Schedule` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Driver`
--

DROP TABLE IF EXISTS `Driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Driver` (
  `driver_person_id` int(11) NOT NULL,
  `driver_experience` float DEFAULT 0,
  `driver_experience_type` enum('day','month','year') DEFAULT 'year',
  `driver_late_arrival_count` int(11) DEFAULT 0,
  PRIMARY KEY (`driver_person_id`),
  CONSTRAINT `fk_driver_person` FOREIGN KEY (`driver_person_id`) REFERENCES `Person` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Driver`
--

LOCK TABLES `Driver` WRITE;
/*!40000 ALTER TABLE `Driver` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Driver` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_check_driver_person_type
BEFORE INSERT ON Driver
FOR EACH ROW
BEGIN
    DECLARE p_type VARCHAR(20);
    SELECT person_type INTO p_type FROM Person WHERE person_id = NEW.driver_person_id;
    IF p_type IS NULL OR p_type != 'driver' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sai kiểu person_type: driver hoặc không tồn tại Person khi thêm Driver!';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Location_City`
--

DROP TABLE IF EXISTS `Location_City`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Location_City` (
  `location_city_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_city_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_uca1400_ai_ci NOT NULL,
  `location_city_status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`location_city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Location_City`
--

LOCK TABLES `Location_City` WRITE;
/*!40000 ALTER TABLE `Location_City` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Location_City` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Location_District`
--

DROP TABLE IF EXISTS `Location_District`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Location_District` (
  `location_district_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_district_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_uca1400_ai_ci NOT NULL,
  `location_city_id` int(11) NOT NULL,
  `location_district_status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`location_district_id`),
  KEY `fk_district_city` (`location_city_id`),
  CONSTRAINT `fk_district_city` FOREIGN KEY (`location_city_id`) REFERENCES `Location_City` (`location_city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Location_District`
--

LOCK TABLES `Location_District` WRITE;
/*!40000 ALTER TABLE `Location_District` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Location_District` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Location_Ward`
--

DROP TABLE IF EXISTS `Location_Ward`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Location_Ward` (
  `location_ward_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_ward_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_uca1400_ai_ci NOT NULL,
  `location_district_id` int(11) NOT NULL,
  `location_ward_status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`location_ward_id`),
  KEY `fk_ward_district` (`location_district_id`),
  CONSTRAINT `fk_ward_district` FOREIGN KEY (`location_district_id`) REFERENCES `Location_District` (`location_district_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Location_Ward`
--

LOCK TABLES `Location_Ward` WRITE;
/*!40000 ALTER TABLE `Location_Ward` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Location_Ward` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Parent`
--

DROP TABLE IF EXISTS `Parent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Parent` (
  `parent_person_id` int(11) NOT NULL,
  `parent_address_id` int(11) DEFAULT NULL,
  `parent_job` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_uca1400_ai_ci DEFAULT NULL,
  `parent_type` enum('father','mother','grandpa','grandma','other') NOT NULL,
  PRIMARY KEY (`parent_person_id`),
  KEY `fk_parent_address` (`parent_address_id`),
  CONSTRAINT `fk_parent_address` FOREIGN KEY (`parent_address_id`) REFERENCES `Address` (`address_id`),
  CONSTRAINT `fk_parent_person` FOREIGN KEY (`parent_person_id`) REFERENCES `Person` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Parent`
--

LOCK TABLES `Parent` WRITE;
/*!40000 ALTER TABLE `Parent` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Parent` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_check_parent_person_type
BEFORE INSERT ON Parent
FOR EACH ROW
BEGIN
    DECLARE p_type VARCHAR(20);
    SELECT person_type INTO p_type FROM Person WHERE person_id = NEW.parent_person_id;
    IF p_type IS NULL OR p_type != 'parent' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sai kiểu person_type: parent hoặc không tồn tại Person khi thêm Parent!';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Person`
--

DROP TABLE IF EXISTS `Person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Person` (
  `person_id` int(11) NOT NULL AUTO_INCREMENT,
  `person_account_id` int(11) DEFAULT NULL,
  `person_phone` varchar(15) DEFAULT NULL,
  `person_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_uca1400_ai_ci NOT NULL,
  `person_gender` tinyint(1) DEFAULT NULL,
  `person_birthday` date DEFAULT NULL,
  `person_type` enum('manager','driver','parent','student','other') NOT NULL,
  `person_life_cycle_status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`person_id`),
  UNIQUE KEY `person_account_id` (`person_account_id`),
  CONSTRAINT `fk_person_account` FOREIGN KEY (`person_account_id`) REFERENCES `Account` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Person`
--

LOCK TABLES `Person` WRITE;
/*!40000 ALTER TABLE `Person` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Person` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Pickup_Schedule`
--

DROP TABLE IF EXISTS `Pickup_Schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pickup_Schedule` (
  `pickup_schedule_id` int(11) NOT NULL AUTO_INCREMENT,
  `pickup_schedule_detail_id` int(11) NOT NULL,
  `pickup_schedule_student_id` int(11) NOT NULL,
  PRIMARY KEY (`pickup_schedule_id`),
  KEY `fk_pickup_detail_schedule` (`pickup_schedule_detail_id`),
  KEY `fk_pickup_student` (`pickup_schedule_student_id`),
  CONSTRAINT `fk_pickup_detail_schedule` FOREIGN KEY (`pickup_schedule_detail_id`) REFERENCES `Detail_Schedule` (`detail_schedule_id`),
  CONSTRAINT `fk_pickup_student` FOREIGN KEY (`pickup_schedule_student_id`) REFERENCES `Student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pickup_Schedule`
--

LOCK TABLES `Pickup_Schedule` WRITE;
/*!40000 ALTER TABLE `Pickup_Schedule` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Pickup_Schedule` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Report`
--

DROP TABLE IF EXISTS `Report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Report` (
  `report_id` int(11) NOT NULL AUTO_INCREMENT,
  `report_driver_id` int(11) NOT NULL,
  `report_time` datetime DEFAULT current_timestamp(),
  `report_type` enum('start_pickup','picked_up','late','dropped_off','warning') NOT NULL,
  `report_content` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_uca1400_ai_ci DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `fk_report_driver` (`report_driver_id`),
  CONSTRAINT `fk_report_driver` FOREIGN KEY (`report_driver_id`) REFERENCES `Driver` (`driver_person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Report`
--

LOCK TABLES `Report` WRITE;
/*!40000 ALTER TABLE `Report` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Report` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(25) NOT NULL,
  `role_created_date` timestamp NULL DEFAULT current_timestamp(),
  `role_active_status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Role` VALUES
(1,'superAdmin','2025-10-18 14:37:00',1),
(2,'admin','2025-10-18 14:37:00',1),
(3,'manager','2025-10-18 14:37:00',1),
(4,'parent','2025-10-18 14:37:00',1),
(5,'driver','2025-10-18 14:37:00',1),
(6,'student','2025-10-18 14:37:00',1);
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Route`
--

DROP TABLE IF EXISTS `Route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Route` (
  `route_id` int(11) NOT NULL AUTO_INCREMENT,
  `route_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_uca1400_ai_ci NOT NULL,
  `route_status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`route_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Route`
--

LOCK TABLES `Route` WRITE;
/*!40000 ALTER TABLE `Route` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Route` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Schedule`
--

DROP TABLE IF EXISTS `Schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Schedule` (
  `schedule_id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_by_manager_id` int(11) NOT NULL,
  `schedule_driver_id` int(11) NOT NULL,
  `schedule_start_date` datetime DEFAULT NULL,
  `schedule_end_date` datetime DEFAULT NULL,
  `schedule_status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`schedule_id`),
  KEY `fk_schedule_manager` (`schedule_by_manager_id`),
  KEY `fk_schedule_driver` (`schedule_driver_id`),
  CONSTRAINT `fk_schedule_driver` FOREIGN KEY (`schedule_driver_id`) REFERENCES `Driver` (`driver_person_id`),
  CONSTRAINT `fk_schedule_manager` FOREIGN KEY (`schedule_by_manager_id`) REFERENCES `Person` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Schedule`
--

LOCK TABLES `Schedule` WRITE;
/*!40000 ALTER TABLE `Schedule` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Schedule` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_check_schedule_manager_type
BEFORE INSERT ON Schedule
FOR EACH ROW
BEGIN
    DECLARE p_type VARCHAR(20);
    SELECT person_type INTO p_type FROM Person WHERE person_id = NEW.schedule_by_manager_id;
    IF p_type IS NULL OR (p_type NOT IN ('manager', 'other')) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sai kiểu person_type: manager/other hoặc không tồn tại Person khi thêm Schedule!';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Student`
--

DROP TABLE IF EXISTS `Student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Student` (
  `student_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_parent_id` int(11) NOT NULL,
  `student_person_id` int(11) NOT NULL,
  `student_grade` int(11) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `student_person_id` (`student_person_id`),
  KEY `fk_student_parent` (`student_parent_id`),
  CONSTRAINT `fk_student_parent` FOREIGN KEY (`student_parent_id`) REFERENCES `Parent` (`parent_person_id`),
  CONSTRAINT `fk_student_person` FOREIGN KEY (`student_person_id`) REFERENCES `Person` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Student`
--

LOCK TABLES `Student` WRITE;
/*!40000 ALTER TABLE `Student` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Student` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_check_student_person_type
BEFORE INSERT ON Student
FOR EACH ROW
BEGIN
    DECLARE p_type VARCHAR(20);
    SELECT person_type INTO p_type FROM Person WHERE person_id = NEW.student_person_id;
    IF p_type IS NULL OR p_type != 'student' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sai kiểu person_type: student hoặc không tồn tại Person khi thêm Student!';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Time_Role`
--

DROP TABLE IF EXISTS `Time_Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Time_Role` (
  `time_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `time_role_start_pickup_time` time DEFAULT NULL,
  `time_role_start_drop_off_time` time DEFAULT NULL,
  `time_role_status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`time_role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Time_Role`
--

LOCK TABLES `Time_Role` WRITE;
/*!40000 ALTER TABLE `Time_Role` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Time_Role` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping routines for database 'SSB'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-10-18 21:51:40
