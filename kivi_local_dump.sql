-- MySQL dump 10.13  Distrib 9.5.0, for macos26.0 (arm64)
--
-- Host: localhost    Database: kivi
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `kivi_billing_records`
--

DROP TABLE IF EXISTS `kivi_billing_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_billing_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `therapist_id` int DEFAULT NULL,
  `centre_id` int DEFAULT NULL,
  `programme_id` varchar(10) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) DEFAULT '0.00',
  `payment_status` enum('pending','paid','partial','cancelled') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `billing_date` date DEFAULT (curdate()),
  `due_date` date DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_billing_records`
--

LOCK TABLES `kivi_billing_records` WRITE;
/*!40000 ALTER TABLE `kivi_billing_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `kivi_billing_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_centres`
--

DROP TABLE IF EXISTS `kivi_centres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_centres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `specialties` json DEFAULT NULL,
  `facilities` json DEFAULT NULL,
  `description` text,
  `established_date` date DEFAULT NULL,
  `operating_hours` varchar(100) DEFAULT NULL,
  `emergency_services` tinyint(1) DEFAULT '0',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_centres`
--

LOCK TABLES `kivi_centres` WRITE;
/*!40000 ALTER TABLE `kivi_centres` DISABLE KEYS */;
INSERT INTO `kivi_centres` VALUES (1,'MindSaid Learning Centre','123 Education Drive, Learning District','New York','NY','10001','+1 (555) 123-4567','center_main@kivicare.com','www.kivicare.com','[\"Learning Therapy\", \"Behavioral Therapy\", \"Speech Therapy\"]','[\"Assessment Room\", \"Therapy Room\", \"Sensory Room\", \"Library\", \"Computer Lab\"]','Premier educational therapy center providing comprehensive learning support services','2020-01-15','8:00 AM - 8:00 PM',1,'active','2026-03-08 06:55:46','2026-03-08 06:56:27'),(5,'Test','Bhedaghat','Jabalpur','Madhya Pradesh','483053','7974507514','test@gmail.com',NULL,'[]',NULL,NULL,NULL,NULL,0,'active','2026-03-08 06:56:57','2026-03-08 06:56:57'),(6,'test 3','Bhedaghat','Jabalpur','Madhya Pradesh','483053','07974507514','test3@gmail.com',NULL,'[\"nj\"]',NULL,NULL,NULL,NULL,0,'active','2026-03-10 09:54:07','2026-03-10 09:54:07');
/*!40000 ALTER TABLE `kivi_centres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_communications`
--

DROP TABLE IF EXISTS `kivi_communications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_communications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int DEFAULT NULL,
  `communication_type` enum('email','sms','call','meeting','note') DEFAULT 'note',
  `subject` varchar(255) DEFAULT NULL,
  `message` text,
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `attachments` json DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `response_required` tinyint(1) DEFAULT '0',
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `kivi_communications_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `kivi_students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kivi_communications_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `kivi_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kivi_communications_ibfk_3` FOREIGN KEY (`receiver_id`) REFERENCES `kivi_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_communications`
--

LOCK TABLES `kivi_communications` WRITE;
/*!40000 ALTER TABLE `kivi_communications` DISABLE KEYS */;
/*!40000 ALTER TABLE `kivi_communications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_encounter_templates`
--

DROP TABLE IF EXISTS `kivi_encounter_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_encounter_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(100) DEFAULT NULL,
  `template_type` enum('session','assessment','progress_report','behavioral_report') DEFAULT 'session',
  `fields` json DEFAULT NULL,
  `sections` json DEFAULT NULL,
  `estimated_time` int DEFAULT '15',
  `created_by` int DEFAULT NULL,
  `usage_count` int DEFAULT '0',
  `is_default` tinyint(1) DEFAULT '0',
  `status` enum('active','inactive','draft') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `kivi_encounter_templates_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `kivi_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_encounter_templates`
--

LOCK TABLES `kivi_encounter_templates` WRITE;
/*!40000 ALTER TABLE `kivi_encounter_templates` DISABLE KEYS */;
INSERT INTO `kivi_encounter_templates` VALUES (1,'General Session Report','Standard template for regular therapy sessions','General','session','[{\"name\": \"session_goals\", \"type\": \"textarea\", \"required\": true}, {\"name\": \"activities\", \"type\": \"textarea\", \"required\": true}, {\"name\": \"student_response\", \"type\": \"select\", \"options\": [\"Excellent\", \"Good\", \"Fair\", \"Needs Improvement\"], \"required\": true}, {\"name\": \"progress_notes\", \"type\": \"textarea\", \"required\": true}]','[{\"title\": \"Session Overview\", \"fields\": [\"session_goals\", \"activities\"]}, {\"title\": \"Student Performance\", \"fields\": [\"student_response\", \"progress_notes\"]}]',15,1,0,1,'active','2026-03-06 09:21:54','2026-03-06 09:21:54'),(2,'Behavioral Assessment','Template for behavioral assessments and observations','Assessment','assessment','[{\"name\": \"behavioral_observations\", \"type\": \"textarea\", \"required\": true}, {\"name\": \"interventions_used\", \"type\": \"checkbox\", \"options\": [\"Positive Reinforcement\", \"Token System\", \"Break Cards\", \"Visual Schedules\"], \"required\": false}, {\"name\": \"behavioral_goals\", \"type\": \"textarea\", \"required\": true}]','[{\"title\": \"Observations\", \"fields\": [\"behavioral_observations\"]}, {\"title\": \"Interventions\", \"fields\": [\"interventions_used\", \"behavioral_goals\"]}]',20,1,0,1,'active','2026-03-06 09:21:54','2026-03-06 09:21:54'),(3,'Progress Report','Monthly progress report template','Progress','progress_report','[{\"name\": \"learning_progress\", \"type\": \"textarea\", \"required\": true}, {\"name\": \"skill_development\", \"type\": \"textarea\", \"required\": true}, {\"name\": \"recommendations\", \"type\": \"textarea\", \"required\": true}, {\"name\": \"parent_feedback\", \"type\": \"textarea\", \"required\": false}]','[{\"title\": \"Academic Progress\", \"fields\": [\"learning_progress\", \"skill_development\"]}, {\"title\": \"Recommendations\", \"fields\": [\"recommendations\", \"parent_feedback\"]}]',25,1,0,1,'active','2026-03-06 09:21:54','2026-03-06 09:21:54');
/*!40000 ALTER TABLE `kivi_encounter_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_encounters`
--

DROP TABLE IF EXISTS `kivi_encounters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_encounters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `encounter_id` varchar(50) DEFAULT NULL,
  `session_id` int DEFAULT NULL,
  `student_id` int NOT NULL,
  `therapist_id` int NOT NULL,
  `centre_id` int NOT NULL,
  `template_id` int DEFAULT NULL,
  `encounter_date` date NOT NULL,
  `encounter_time` time NOT NULL,
  `encounter_type` enum('session_report','assessment','progress_report','behavioral_report') DEFAULT 'session_report',
  `session_goals` text,
  `activities_conducted` text,
  `student_response` text,
  `progress_notes` text,
  `challenges_faced` text,
  `recommendations` text,
  `next_session_plan` text,
  `assessment_type` varchar(100) DEFAULT NULL,
  `assessment_results` text,
  `scores` json DEFAULT NULL,
  `behavioral_observations` text,
  `interventions_used` text,
  `behavioral_goals` text,
  `attachments` json DEFAULT NULL,
  `images` json DEFAULT NULL,
  `audio_recordings` json DEFAULT NULL,
  `encounter_data` json DEFAULT NULL,
  `completion_percentage` int DEFAULT '0',
  `parent_feedback` text,
  `home_activities` text,
  `parent_signature` longtext,
  `status` enum('draft','completed','reviewed','signed','archived') DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `body_chart_annotations` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `encounter_id` (`encounter_id`),
  KEY `session_id` (`session_id`),
  KEY `student_id` (`student_id`),
  KEY `therapist_id` (`therapist_id`),
  KEY `centre_id` (`centre_id`),
  KEY `template_id` (`template_id`),
  CONSTRAINT `kivi_encounters_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `kivi_sessions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `kivi_encounters_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `kivi_students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kivi_encounters_ibfk_3` FOREIGN KEY (`therapist_id`) REFERENCES `kivi_therapists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kivi_encounters_ibfk_4` FOREIGN KEY (`centre_id`) REFERENCES `kivi_centres` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kivi_encounters_ibfk_5` FOREIGN KEY (`template_id`) REFERENCES `kivi_encounter_templates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_encounters`
--

LOCK TABLES `kivi_encounters` WRITE;
/*!40000 ALTER TABLE `kivi_encounters` DISABLE KEYS */;
INSERT INTO `kivi_encounters` VALUES (1,'ENC20260310463',NULL,2,4,1,NULL,'2026-03-10','13:00:00','session_report','fgdfg',NULL,NULL,'',NULL,'',NULL,NULL,NULL,NULL,'fdffg',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'completed','2026-03-10 17:31:41','2026-03-10 17:47:52','[{\"id\":1773164822248,\"x\":51.45772594752187,\"y\":3.436073895111892,\"note\":\"head\",\"type\":\"observation\"}]'),(2,'ENC20260310080',NULL,2,4,1,NULL,'2026-03-10','12:00:00','session_report','this is test roblems',NULL,NULL,'',NULL,'',NULL,NULL,NULL,NULL,'this is test observation',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'completed','2026-03-10 17:32:07','2026-03-10 17:32:07',NULL),(3,'ENC20260310030',NULL,2,4,1,NULL,'2026-03-10','13:00:00','session_report','fgdfg',NULL,NULL,'',NULL,'',NULL,NULL,NULL,NULL,'fdffg',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'draft','2026-03-10 17:32:48','2026-03-10 17:32:48',NULL),(4,'ENC20260310893',NULL,2,4,1,NULL,'2026-03-10','13:00:00','session_report','fgdfg',NULL,NULL,'',NULL,'',NULL,NULL,NULL,NULL,'fdffg',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'completed','2026-03-10 17:33:16','2026-03-10 17:33:16',NULL),(6,'ENC20260310760',NULL,2,4,1,NULL,'2026-03-10','13:00:00','session_report','fdfgfgf',NULL,NULL,'',NULL,'',NULL,NULL,NULL,NULL,'rgr retrt',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'completed','2026-03-10 17:36:02','2026-03-10 17:36:02',NULL),(7,'ENC20260310696',NULL,2,4,1,NULL,'2026-03-10','13:00:00','session_report','fgdfg',NULL,NULL,'',NULL,'',NULL,NULL,NULL,NULL,'fdffg',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'completed','2026-03-10 17:41:45','2026-03-10 17:41:45','[{\"id\":1773164391085,\"x\":50.437317784256564,\"y\":3.748444249212973,\"note\":\"this is head pain\",\"type\":\"observation\"},{\"id\":1773164402418,\"x\":66.90962099125365,\"y\":22.178295141176758,\"note\":\"sholder pain\",\"type\":\"observation\"}]'),(8,'ENC20260310411',NULL,2,4,1,NULL,'2026-03-10','13:00:00','session_report','fgdfg',NULL,NULL,'',NULL,'',NULL,NULL,NULL,NULL,'fdffg',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'completed','2026-03-10 17:42:17','2026-03-10 17:42:17','[{\"id\":1773164526034,\"x\":52.04081632653062,\"y\":4.060814603314054,\"note\":\"head\",\"type\":\"observation\"}]'),(9,'ENC20260310211',NULL,2,4,1,NULL,'2026-03-10','13:00:00','session_report','fgdfg',NULL,NULL,'',NULL,'',NULL,NULL,NULL,NULL,'fdffg',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'completed','2026-03-10 17:44:04','2026-03-10 17:44:04','[{\"id\":1773164630100,\"x\":49.416909620991255,\"y\":4.164938054681081,\"note\":\"dfdgf\",\"type\":\"observation\"},{\"id\":1773164636033,\"x\":69.24198250728864,\"y\":22.490665495277838,\"note\":\"fvcv\",\"type\":\"observation\"}]'),(10,'ENC20260310916',NULL,2,4,1,NULL,'2026-03-10','13:00:00','session_report','fgdfg',NULL,NULL,'',NULL,'',NULL,NULL,NULL,NULL,'fdffg',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'completed','2026-03-10 17:45:19','2026-03-10 17:45:19','[{\"id\":1773164713952,\"x\":51.74927113702624,\"y\":3.85256770058,\"note\":\"rdffffddf\",\"type\":\"observation\"}]');
/*!40000 ALTER TABLE `kivi_encounters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_payments`
--

DROP TABLE IF EXISTS `kivi_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `payment_id` varchar(255) NOT NULL,
  `signature` text,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(3) DEFAULT 'INR',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  UNIQUE KEY `payment_id` (`payment_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_payment_id` (`payment_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_status` (`status`),
  KEY `idx_paid_at` (`paid_at`),
  CONSTRAINT `kivi_payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `kivi_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_payments`
--

LOCK TABLES `kivi_payments` WRITE;
/*!40000 ALTER TABLE `kivi_payments` DISABLE KEYS */;
INSERT INTO `kivi_payments` VALUES (1,4,39516,'order_SPVFNygQRqHPQs','pay_SPVFUbIQnoOsQ2','58d9fb47f698eb9356ba1b2fcecdb939a52eb4295ad5fcd8773fc736665a13c3','completed',15.00,'INR','2026-03-10 05:46:33','2026-03-10 11:16:33','2026-03-10 11:16:33'),(2,4,39516,'order_SPVH33kJjna3QU','pay_SPVH6a5ZgwZwS3','f437c22dc459e06babef2c3fc433fdee65721ca8a94575ca7c534ffc4bbdac43','completed',15.00,'INR','2026-03-10 05:48:01','2026-03-10 11:18:02','2026-03-10 11:18:02'),(3,4,39516,'order_SPVIxF1ZEBT7re','pay_SPVJ0l980NSvOy','90c2e7c2adce3e6455c83d1534baa5b050b8eaabe031a7750cc2158a6ba6f1bf','completed',15.00,'INR','2026-03-10 05:49:50','2026-03-10 11:19:51','2026-03-10 11:19:51'),(4,4,82681,'order_SQACFPMA1uiA7N','pay_SQACNqTKeisIxb','db27cc6fb2ce0334fe4fa5987bedefbf4ee78fed2016e643d76e83b2ed1445e3','completed',10.00,'INR','2026-03-11 21:50:00','2026-03-12 03:20:01','2026-03-12 03:20:01'),(5,4,39516,'order_SQAe0ld17cTWx5','pay_SQAe6c2Ow5zgIN','c4588f545a2a71010e636188586eed1383e6a42049bcae43d9fa9f6f25022324','completed',15.00,'INR','2026-03-11 22:16:16','2026-03-12 03:46:17','2026-03-12 03:46:17'),(6,4,40578,'order_SQBIYM4Asf8s4I','pay_SQBIeZTqdeFDIs','84918e2e16e363589aa9b1e7e96160fd26af82c4915bc5aa9612b11be1ed6111','completed',30.00,'INR','2026-03-11 22:54:38','2026-03-12 04:24:38','2026-03-12 04:24:38'),(7,4,40578,'order_SQBLV5TJTN9C56','pay_SQBLYrKMuJpbOQ','d78f3f2aecbe2d766b53792eeacc5159be46b39341b5add62d51932832b6a301','completed',30.00,'INR','2026-03-11 22:57:24','2026-03-12 04:27:25','2026-03-12 04:27:25'),(8,4,39516,'order_SQBNmTwOB436hg','pay_SQBNqliRrJARrU','dfbf029ed357b59a954796751ee003d09dde20a57ad55a0e0f21f3da02341139','completed',15.00,'INR','2026-03-11 22:59:34','2026-03-12 04:29:34','2026-03-12 04:29:34'),(9,4,39516,'order_SQBP33sbCHn2jg','pay_SQBP6Q6bv1Kja5','1ab08fae69abcfdb188c0429945935ef7fad16e1fcaba9a6af35762899d747a1','completed',15.00,'INR','2026-03-11 23:00:44','2026-03-12 04:30:45','2026-03-12 04:30:45'),(10,4,39516,'order_SQBQ0lPkO8QC8J','pay_SQBQUjUZHRi2uA','703f7e13db9dcfa5773b1ea7dc254637c6d81c6073688bdfc790ae2ceece3fe5','completed',15.00,'INR','2026-03-11 23:02:04','2026-03-12 04:32:04','2026-03-12 04:32:04'),(11,4,39516,'order_SQBRJsMgCx0HlK','pay_SQBRNSpEfBu1dF','8417aca5a90b0e7f066fa8b9e2f6bece1ded7c725ded2149ec8e83e6a0725eb5','completed',15.00,'INR','2026-03-11 23:02:55','2026-03-12 04:32:55','2026-03-12 04:32:55'),(12,4,39516,'order_SQBTCLoNR0MBUY','pay_SQBTFaaMYHhnGV','f867a1d8e71aeeeb02ed3b63e7e0308f393c01d1313e9f86035e618fb778312c','completed',15.00,'INR','2026-03-11 23:04:40','2026-03-12 04:34:41','2026-03-12 04:34:41'),(13,4,39516,'order_SQBUhhmHhqeKwU','pay_SQBUkk47zbuH5B','fb3bd3834dcf797db2edc8704e270f30818b5ec2439b2ae86a1f7c221341e0b7','completed',15.00,'INR','2026-03-11 23:06:05','2026-03-12 04:36:06','2026-03-12 04:36:06'),(14,4,39516,'order_SQBXPYYIXQJ1mV','pay_SQBXTXae6Be9NL','7bbaf80cc047db3499a370471cb9d7738a2c25b5e62f447987b4b15ad396b2bc','completed',15.00,'INR','2026-03-11 23:08:41','2026-03-12 04:38:41','2026-03-12 04:38:41'),(15,4,39516,'order_SQBbkPdP759OR9','pay_SQBbpDESxaSka3','cf1d64096f007de941774058bee9a7e55012accb7bb98c38b6138195c698eb09','completed',15.00,'INR','2026-03-11 23:12:49','2026-03-12 04:42:49','2026-03-12 04:42:49'),(16,4,39516,'order_SQBejCYLtUwoDS','pay_SQBemV7ycv79TW','ba17d2363cca8ef11eefb135927a5e7f237c23f4c00489bd8f066d597c6a1011','completed',15.00,'INR','2026-03-11 23:15:35','2026-03-12 04:45:36','2026-03-12 04:45:36');
/*!40000 ALTER TABLE `kivi_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_plans`
--

DROP TABLE IF EXISTS `kivi_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` enum('session','assessment') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `description` text,
  `features` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_plans`
--

LOCK TABLES `kivi_plans` WRITE;
/*!40000 ALTER TABLE `kivi_plans` DISABLE KEYS */;
INSERT INTO `kivi_plans` VALUES (1,'Remedial Therapy','session',2000.00,'1 Hour','Comprehensive remedial therapy sessions for learning difficulties','[\"One-on-one therapy session\", \"Customized learning approach\", \"Progress tracking\", \"Parent consultation\"]',1,'2026-03-06 09:21:54','2026-03-06 09:21:54'),(2,'Occupational Therapy','session',1500.00,'1 Hour','Specialized occupational therapy for daily living skills','[\"Sensory integration therapy\", \"Fine motor skill development\", \"Daily living activities\", \"Equipment recommendations\"]',1,'2026-03-06 09:21:54','2026-03-06 09:21:54'),(3,'Speech Language Therapy','session',1500.00,'1 Hour','Professional speech and language development therapy','[\"Speech articulation training\", \"Language development\", \"Communication skills\", \"Swallowing therapy\"]',1,'2026-03-06 09:21:54','2026-03-06 09:21:54'),(4,'Counselling','session',1500.00,'1 Hour','Professional counselling and psychological support','[\"Individual counselling\", \"Behavioral therapy\", \"Emotional support\", \"Coping strategies\"]',1,'2026-03-06 09:21:54','2026-03-06 09:21:54'),(5,'Package I - Comprehensive Assessment','assessment',45500.00,NULL,'Complete psycho-educational assessment with detailed report','[\"Full cognitive assessment\", \"Academic achievement testing\", \"Behavioral evaluation\", \"Detailed written report\", \"Parent consultation\", \"School recommendations\"]',1,'2026-03-06 09:21:54','2026-03-06 09:21:54'),(6,'Package II - Standard Assessment','assessment',32500.00,NULL,'Standard psycho-educational assessment package','[\"Cognitive assessment\", \"Academic testing\", \"Written report\", \"Parent consultation\", \"Basic recommendations\"]',1,'2026-03-06 09:21:54','2026-03-06 09:21:54'),(7,'Package III - Essential Assessment','assessment',28500.00,NULL,'Essential assessment for learning difficulties','[\"Core cognitive testing\", \"Academic screening\", \"Summary report\", \"Parent meeting\"]',1,'2026-03-06 09:21:54','2026-03-06 09:21:54'),(8,'Package IV - Basic Assessment','assessment',15500.00,NULL,'Basic screening and assessment package','[\"Basic cognitive screening\", \"Academic review\", \"Brief report\", \"Consultation\"]',1,'2026-03-06 09:21:54','2026-03-06 09:21:54');
/*!40000 ALTER TABLE `kivi_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_programmes`
--

DROP TABLE IF EXISTS `kivi_programmes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_programmes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `programme_id` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `centre_id` int DEFAULT NULL,
  `therapist_id` int DEFAULT NULL,
  `fee` decimal(10,2) DEFAULT '0.00',
  `duration` int DEFAULT '60',
  `description` text,
  `objectives` text,
  `target_age_group` varchar(50) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `therapist_id` (`therapist_id`),
  CONSTRAINT `kivi_programmes_ibfk_1` FOREIGN KEY (`therapist_id`) REFERENCES `kivi_therapists` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_programmes`
--

LOCK TABLES `kivi_programmes` WRITE;
/*!40000 ALTER TABLE `kivi_programmes` DISABLE KEYS */;
INSERT INTO `kivi_programmes` VALUES (14,'P39516','Test One','Session Plan',1,4,1500.00,60,'this is test desc',NULL,NULL,'active','2026-03-10 07:32:10','2026-03-10 06:22:20'),(16,'P82681','test2','Session Plan',3,NULL,1000.00,30,'dkfdn',NULL,NULL,'active','2026-03-10 06:54:43','2026-03-10 06:54:43'),(17,'P40578','test3','Session Plan',1,4,3000.00,60,'this is test3',NULL,NULL,'active','2026-03-10 09:37:21','2026-03-10 09:37:21');
/*!40000 ALTER TABLE `kivi_programmes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_sessions`
--

DROP TABLE IF EXISTS `kivi_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` varchar(50) NOT NULL,
  `student_id` int DEFAULT NULL,
  `therapist_id` int DEFAULT NULL,
  `centre_id` int DEFAULT NULL,
  `programme_id` varchar(10) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `session_date` date NOT NULL,
  `session_time` time NOT NULL,
  `duration` int DEFAULT '60',
  `session_type` enum('individual','group','assessment') DEFAULT 'individual',
  `status` enum('scheduled','confirmed','completed','cancelled','no_show') DEFAULT 'scheduled',
  `notes` text,
  `preparation_notes` text,
  `materials_needed` text,
  `session_goals` text,
  `room_number` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_id` (`session_id`),
  KEY `idx_sessions_created_by` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_sessions`
--

LOCK TABLES `kivi_sessions` WRITE;
/*!40000 ALTER TABLE `kivi_sessions` DISABLE KEYS */;
INSERT INTO `kivi_sessions` VALUES (15,'SES1773285601409R3CAP',2,4,3,'P82681',5,'2026-03-13','11:00:00',60,'individual','scheduled','',NULL,NULL,NULL,NULL,'2026-03-12 03:20:01','2026-03-12 06:50:32'),(18,'SES17732907364314DR3V',4,4,1,'39516',4,'2026-03-14','15:00:00',60,'individual','scheduled','',NULL,NULL,NULL,NULL,'2026-03-11 23:15:36','2026-03-12 06:46:33');
/*!40000 ALTER TABLE `kivi_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_staff`
--

DROP TABLE IF EXISTS `kivi_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `centre_id` int DEFAULT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `shift` enum('morning','evening','night','full_day') DEFAULT 'full_day',
  `salary` decimal(10,2) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `emergency_contact_name` varchar(100) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `profile_image` longtext,
  `permissions` json DEFAULT NULL,
  `status` enum('active','inactive','on_leave','terminated') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  KEY `user_id` (`user_id`),
  KEY `centre_id` (`centre_id`),
  CONSTRAINT `kivi_staff_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `kivi_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kivi_staff_ibfk_2` FOREIGN KEY (`centre_id`) REFERENCES `kivi_centres` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_staff`
--

LOCK TABLES `kivi_staff` WRITE;
/*!40000 ALTER TABLE `kivi_staff` DISABLE KEYS */;
/*!40000 ALTER TABLE `kivi_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_student_progress`
--

DROP TABLE IF EXISTS `kivi_student_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_student_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `therapist_id` int NOT NULL,
  `programme_id` int DEFAULT NULL,
  `assessment_date` date NOT NULL,
  `progress_type` enum('weekly','monthly','quarterly','annual') DEFAULT 'monthly',
  `learning_goals_met` json DEFAULT NULL,
  `skill_improvements` json DEFAULT NULL,
  `behavioral_changes` text,
  `academic_progress` text,
  `social_skills_progress` text,
  `attention_rating` int DEFAULT NULL,
  `participation_rating` int DEFAULT NULL,
  `cooperation_rating` int DEFAULT NULL,
  `progress_rating` int DEFAULT NULL,
  `recommendations` text,
  `next_goals` text,
  `parent_involvement` text,
  `progress_charts` longtext,
  `assessment_documents` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `therapist_id` (`therapist_id`),
  KEY `programme_id` (`programme_id`),
  CONSTRAINT `kivi_student_progress_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `kivi_students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kivi_student_progress_ibfk_2` FOREIGN KEY (`therapist_id`) REFERENCES `kivi_therapists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kivi_student_progress_ibfk_3` FOREIGN KEY (`programme_id`) REFERENCES `kivi_programmes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_student_progress`
--

LOCK TABLES `kivi_student_progress` WRITE;
/*!40000 ALTER TABLE `kivi_student_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `kivi_student_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_students`
--

DROP TABLE IF EXISTS `kivi_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `centre_id` int DEFAULT NULL,
  `registration_date` date DEFAULT (curdate()),
  `status` enum('active','inactive','graduated','transferred') DEFAULT 'active',
  `user_id` int DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `emergency_contact_name` varchar(100) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `emergency_contact_relation` varchar(50) DEFAULT NULL,
  `learning_needs` text,
  `support_requirements` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_students`
--

LOCK TABLES `kivi_students` WRITE;
/*!40000 ALTER TABLE `kivi_students` DISABLE KEYS */;
INSERT INTO `kivi_students` VALUES (1,'ST001','John','Doe','student@example.com','+91-9876543214','2010-05-14',14,'male',1,'2024-01-15','active',6,'Bhedaghat','Jabalpur','Madhya Pradesh',NULL,NULL,NULL,NULL,'fvf','ffgf','2026-03-12 04:26:30','2026-03-12 04:26:30'),(2,'STU1772955715054','Test ','Student','test@gmail.com','1234567890','2026-03-05',NULL,'male',1,'2026-03-08','active',NULL,'Bhedaghat','Jabalpur','Madhya Pradesh','','Aditya Sharma','7974507514','Parent','fdd','fgdf','2026-03-12 04:26:30','2026-03-12 06:18:36');
/*!40000 ALTER TABLE `kivi_students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_system_settings`
--

DROP TABLE IF EXISTS `kivi_system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_system_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text,
  `setting_type` enum('string','number','boolean','json') DEFAULT 'string',
  `description` text,
  `is_public` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_system_settings`
--

LOCK TABLES `kivi_system_settings` WRITE;
/*!40000 ALTER TABLE `kivi_system_settings` DISABLE KEYS */;
INSERT INTO `kivi_system_settings` VALUES (1,'system_name','KiviCare','string','System name displayed in the application',1,'2026-03-06 09:21:54','2026-03-06 09:21:54'),(2,'default_session_duration','30','number','Default session duration in minutes',0,'2026-03-06 09:21:54','2026-03-06 09:21:54'),(3,'max_file_size','10485760','number','Maximum file size for uploads in bytes (10MB)',0,'2026-03-06 09:21:54','2026-03-06 09:21:54'),(4,'supported_image_formats','[\"jpg\", \"jpeg\", \"png\", \"gif\", \"webp\"]','json','Supported image file formats',0,'2026-03-06 09:21:54','2026-03-06 09:21:54'),(5,'backup_frequency','daily','string','Database backup frequency',0,'2026-03-06 09:21:54','2026-03-06 09:21:54'),(6,'session_reminder_hours','24','number','Hours before session to send reminder',0,'2026-03-06 09:21:54','2026-03-06 09:21:54');
/*!40000 ALTER TABLE `kivi_system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_taxes`
--

DROP TABLE IF EXISTS `kivi_taxes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_taxes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `rate` decimal(5,2) NOT NULL,
  `type` enum('percentage','fixed') DEFAULT 'percentage',
  `applicable_to` enum('all','programmes','sessions','assessments') DEFAULT 'all',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_taxes`
--

LOCK TABLES `kivi_taxes` WRITE;
/*!40000 ALTER TABLE `kivi_taxes` DISABLE KEYS */;
INSERT INTO `kivi_taxes` VALUES (1,'GST 18%',18.00,'percentage','all','active','2026-03-06 09:21:54','2026-03-06 09:21:54'),(2,'GST 12%',12.00,'percentage','programmes','active','2026-03-06 09:21:54','2026-03-06 09:21:54'),(3,'GST 5%',5.00,'percentage','assessments','active','2026-03-06 09:21:54','2026-03-06 09:21:54'),(4,'Service Tax',100.00,'fixed','sessions','active','2026-03-06 09:21:54','2026-03-06 09:21:54');
/*!40000 ALTER TABLE `kivi_taxes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_therapists`
--

DROP TABLE IF EXISTS `kivi_therapists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_therapists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `centre_id` int DEFAULT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `specialty` varchar(255) NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `license_number` varchar(100) DEFAULT NULL,
  `experience_years` int DEFAULT '0',
  `session_fee` decimal(10,2) DEFAULT '0.00',
  `bio` text,
  `profile_image` longtext,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `status` enum('active','inactive','on_leave','suspended') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `availability` json DEFAULT NULL,
  `certifications` json DEFAULT NULL,
  `languages` json DEFAULT NULL,
  `session_duration` int DEFAULT '30',
  `login_time` time DEFAULT '09:00:00',
  `logout_time` time DEFAULT '18:00:00',
  `is_available` tinyint(1) DEFAULT '1',
  `last_availability_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `emergency_contact_name` varchar(100) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `relation` varchar(50) DEFAULT NULL,
  `primary_clinic_id` int DEFAULT NULL,
  `professional_certifications` text,
  `spoken_languages` text,
  `date_of_birth_text` varchar(20) DEFAULT NULL,
  `availability_status` enum('available','unavailable','busy') DEFAULT 'available',
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_therapists`
--

LOCK TABLES `kivi_therapists` WRITE;
/*!40000 ALTER TABLE `kivi_therapists` DISABLE KEYS */;
INSERT INTO `kivi_therapists` VALUES (2,4,2,'TH002','Occupational Therapy','BOT, MOT in Occupational Therapy','LIC123457',6,1500.00,'Certified occupational therapist with expertise in sensory integration and motor skills development.',NULL,'1987-07-22','male','2021-03-10','active','2026-03-06 09:21:54','2026-03-07 08:15:51','{\"friday\": [\"09:00-17:00\"], \"monday\": [\"09:00-17:00\"], \"tuesday\": [\"09:00-17:00\"], \"thursday\": [\"09:00-17:00\"], \"wednesday\": [\"09:00-17:00\"]}',NULL,NULL,30,'09:00:00','18:00:00',1,'2026-03-07 08:15:51',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'available'),(4,19,1,'TH1772887042079','Learning Therapy','PHD','XYAZ1234H',20,2000.00,'kjkjn',NULL,'2000-05-18','male','2014-03-01','active','2026-03-07 12:37:22','2026-03-09 10:56:00',NULL,'[\"PHD in Learning Therapy\", \"Certified Special Education\"]','[\"English\", \"Hindi\"]',30,'09:00:00','18:00:00',1,'2026-03-09 10:56:00','Bhedaghat','Jabalpur','Madhya Pradesh','','Aditya Sharma','7974507514','Self',1,'PHD in Learning Therapy, Certified Special Education','English, Hindi, Marathi','22/05/2000','available');
/*!40000 ALTER TABLE `kivi_therapists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_user_plans`
--

DROP TABLE IF EXISTS `kivi_user_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_user_plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `selected_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `plan_id` (`plan_id`),
  CONSTRAINT `kivi_user_plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `kivi_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kivi_user_plans_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `kivi_plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_user_plans`
--

LOCK TABLES `kivi_user_plans` WRITE;
/*!40000 ALTER TABLE `kivi_user_plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `kivi_user_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kivi_users`
--

DROP TABLE IF EXISTS `kivi_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kivi_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','therapist','staff','student','parent') DEFAULT 'admin',
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `date_of_birth` date DEFAULT NULL,
  `relation` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kivi_users`
--

LOCK TABLES `kivi_users` WRITE;
/*!40000 ALTER TABLE `kivi_users` DISABLE KEYS */;
INSERT INTO `kivi_users` VALUES (1,'admin@mindsaidlearning.com','admin123','admin','Admin','User','+91-9876543210',1,NULL,NULL,'2026-03-09 10:45:23'),(2,'admin2@mindsaidlearning.com','admin123','admin','Admin','User','+91-9876543211',1,NULL,NULL,'2026-03-09 10:45:23'),(3,'superadmin@mindsaidlearning.com','super123','admin','Super','Admin','+91-9876543212',1,NULL,NULL,'2026-03-09 10:45:23'),(4,'parent.john.smith@gmail.com','parent123','parent','John','Smith','+91-9876543213',1,NULL,NULL,'2026-03-09 10:45:23'),(5,'parent.mary.jones@gmail.com','parent123','parent','Mary','Jones','+91-9876543214',1,NULL,NULL,'2026-03-09 10:45:23'),(6,'parent.william.davis@gmail.com','parent123','parent','William','Davis','+91-9876543215',1,NULL,NULL,'2026-03-09 10:45:23'),(7,'therapist1@test.com','pass123','therapist','John','Smith','+91-9876543216',1,NULL,NULL,'2026-03-09 10:45:23'),(8,'therapist2@test.com','pass123','therapist','Jane','Doe','+91-9876543217',1,NULL,NULL,'2026-03-09 10:45:23'),(9,'admin@kivi.com','admin123','admin','Admin','User','+91-9876543210',1,NULL,NULL,'2026-03-09 10:45:23'),(10,'dr.sarah.johnson@mindsaidlearning.com','therapist123','therapist','Sarah','Johnson','+91-9876543211',1,NULL,NULL,'2026-03-09 10:45:23'),(11,'dr.michael.brown@mindsaidlearning.com','therapist123','therapist','Michael','Brown','+91-9876543212',1,NULL,NULL,'2026-03-09 10:45:23'),(12,'dr.emily.davis@mindsaidlearning.com','therapist123','therapist','Emily','Davis','+91-9876543213',1,NULL,NULL,'2026-03-09 10:45:23'),(13,'student@example.com','student123','student','John','Doe','+91-9876543214',1,NULL,NULL,'2026-03-09 10:45:23'),(14,'katre@gmal.com','therapist123','therapist','Dr. Jagannath ','Katre','9516696009',1,NULL,NULL,'2026-03-09 10:45:23'),(19,'katre@gmail.com','Tiger@123','therapist','Dr.Jagannath','Katre','9516696009',1,'2000-05-18','Self','2026-03-09 10:45:23');
/*!40000 ALTER TABLE `kivi_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-12 12:44:16
