-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: high_street_gym
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `activity_id` int NOT NULL AUTO_INCREMENT,
  `activity_name` varchar(100) NOT NULL,
  `activity_description` varchar(255) NOT NULL,
  `activity_duration` int NOT NULL,
  PRIMARY KEY (`activity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,'Body Pump','This exercise is a weight training session to isolate your fat from muscle.',55),(2,'Yoga','This exercise is a Yoga session to stretch your body and relaxation your body and mental health.',45),(5,'Boxing','Exercise',45),(6,'Zumba','Dance',60),(7,'Pilates','Streching and Core',45),(8,'Abs','Abs exercise',45),(9,'HIIT','Cardio Exercise',55),(10,'Indoor Cycling','Cycling exercise',45);
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `post_user_id` int NOT NULL,
  `post_title` varchar(45) NOT NULL,
  `post_datetime` datetime NOT NULL,
  `post_content` varchar(255) NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `fk_post_user_idx` (`post_user_id`),
  CONSTRAINT `fk_post_user` FOREIGN KEY (`post_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
INSERT INTO `blog_posts` VALUES (26,14,'Title','2024-06-04 03:50:14','Test'),(30,12,'Title','2024-06-05 02:46:16','sdfdsfs'),(33,12,' Title','2024-06-09 11:20:21','asd'),(36,12,'Title','2024-06-09 11:28:11','dsfsdfdsfdsf'),(38,3,'My First Blog Post','2024-10-01 14:53:02','This is the content of my first blog post 55555.'),(39,12,'My First Blog Post','2024-10-04 03:50:15','This is the content of my first blog post.'),(40,12,'My First Blog Post','2024-10-04 15:35:03','This is the content of my first blog post.5555'),(43,12,'My First Blog Post','2024-10-05 07:11:13','This is the content of my first blog post.55557899'),(44,12,'My First Blog Post','2024-10-05 07:12:44','This is the content of my first blog post.55557899'),(45,12,'My First Blog Post','2024-10-05 07:20:49','This is the content of my first blog post.55557'),(46,12,'hkjhj','2024-10-05 07:29:03','jhlhlkhl'),(47,12,'fgfsdgdf','2024-10-05 07:32:25','gdfgfd'),(49,14,'fdsfsdf','2024-10-07 09:47:28','sdfdsf');
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `booking_user_id` int NOT NULL,
  `booking_class_id` int NOT NULL,
  `booking_created_datetime` datetime NOT NULL,
  `class_trainer_user_id` int NOT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `fk_booking_user_idx` (`booking_user_id`),
  KEY `fk_booking_class_idx` (`booking_class_id`),
  CONSTRAINT `fk_booking_class` FOREIGN KEY (`booking_class_id`) REFERENCES `classes` (`class_id`),
  CONSTRAINT `fk_booking_user` FOREIGN KEY (`booking_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (7,2,7,'2024-06-07 09:06:39',0),(21,14,7,'2024-06-07 09:07:14',0),(22,14,7,'2024-06-04 03:50:29',0),(29,14,3,'2024-06-06 00:44:15',0),(30,12,2,'2024-06-06 03:14:51',0),(31,12,2,'2024-06-06 03:47:36',0),(33,12,3,'2024-06-07 07:35:40',0),(38,14,4,'2024-10-11 04:25:36',0);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `class_datetime` datetime NOT NULL,
  `class_location_id` int NOT NULL,
  `class_activity_id` int NOT NULL,
  `class_trainer_user_id` int NOT NULL,
  `class_remove` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`class_id`),
  KEY `fk_activity_idx` (`class_activity_id`),
  KEY `fk_class_user_idx` (`class_trainer_user_id`),
  KEY `fk_class_location_idx` (`class_location_id`),
  CONSTRAINT `fk_class_activity` FOREIGN KEY (`class_activity_id`) REFERENCES `activities` (`activity_id`),
  CONSTRAINT `fk_class_location` FOREIGN KEY (`class_location_id`) REFERENCES `location` (`location_id`),
  CONSTRAINT `fk_class_user` FOREIGN KEY (`class_trainer_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (2,'2024-06-20 10:30:00',1,2,3,0),(3,'2024-06-14 15:00:00',1,8,3,0),(4,'2024-06-13 18:00:00',1,5,3,0),(6,'2024-06-01 10:30:00',4,6,13,0),(7,'2024-06-15 08:15:00',2,5,13,0),(9,'2024-06-13 10:05:00',2,10,13,0),(11,'2024-06-06 06:00:00',1,1,13,0),(12,'2024-06-19 08:30:00',1,7,3,0),(13,'2024-06-05 10:30:00',4,6,13,0),(14,'2024-10-05 10:30:00',4,6,13,0),(15,'2024-10-10 10:30:00',4,6,13,0),(16,'2024-10-10 10:30:00',4,6,13,0),(17,'2024-10-10 10:30:00',4,8,13,0),(18,'2024-10-10 10:30:00',4,8,3,0),(19,'2024-10-15 10:30:00',4,8,3,0),(20,'2024-10-13 10:30:00',1,10,13,0),(21,'2024-10-13 10:30:00',2,8,3,0),(22,'2024-10-15 10:30:00',1,5,13,0);
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `location_name` varchar(255) NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'Ashgrove'),(2,' Brisbane City'),(3,'Chermside'),(4,'Graceville'),(5,'Westlake');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) NOT NULL,
  `user_password` varchar(75) NOT NULL,
  `user_role` enum('trainer','admin','members') NOT NULL,
  `user_phone` varchar(45) NOT NULL,
  `user_firstname` varchar(100) NOT NULL,
  `user_lastname` varchar(100) NOT NULL,
  `user_address` varchar(255) NOT NULL,
  `user_authentication_key` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'chunlim@gmail.com','$2a$10$vh3DSZhDqaZW3FMn2YNDde3MIpLe55w66iykI.n5EtR2PDvhCpfiW','admin','041-2584563','Chun','Lim','25 wharf st., brisbane, QLD 4000',''),(2,'sparrow123@gmail.com','$2a$10$u.KUzS1VA4K0P0w0W8g78OVtGKSf8zvfQhzHawyfLpyJu8XSQY0D.','members','042-2548532','Jack','Sparrow','85 west end, brisbane, QLD 4101',''),(3,'ken789@gmail.com','$2a$10$iXr.DHP91s17U4Je9UCnY.PzcFKuhX9ALz0RpgHKbznaXtB63LQgi','trainer','042-2543698','Ken','Nakarin','45 west end, brisbane, QLD 4101',''),(11,'chun@gmail.com','$2a$10$PHtXIlmvN64nRiZ9HKs1KeaNnk.qWW7EK2DiPcW5i2LmGPO9JTqH2','members','0412585463','Chun','Lim','25 wharf st., brisbane, QLD 4000',''),(12,'Lim@gmail.com','$2a$10$LV/iLB4Z.MFxoIMAxv7Qt.cw2nLSCbRf/PEfIAnqZlVJEdo/kz99a','admin','0521425365','Lim','Chun','55 west end, brisbane, QLD 4101','0a3bc7b7-bb0f-464b-a429-262e25786eaf'),(13,'Chris@gmail.com','$2a$10$aLRFE/Rnh9c0w2Hja3s2tuW1m8Zjx6JsDTq0izX2bR86t9CJnEnJW','trainer','0124253653','Chris','Home','asdasdasdadas','8c8efb6b-d5dd-4116-abce-678d4c1f760a'),(14,'Homme@gmail.com','$2a$10$3JUMFG.9UU5cTyeQyTZQduyt2oZd0h4z9T1r3t2ZTUnCgdjmwQN1O','members','0125235632','Homme','Cher','asadsa545','6d874173-67e3-4f59-a513-ce204651220e'),(16,'Jade@gmail.com','$2a$10$s/R45nBqPYQtFxwGdW1gpejbNo21w9D/EwBmgnESyjNJeTdhd9a5a','members','0412523258','Jade','JG','asdsad',''),(18,'Pong@gmail.com','abc123','members','0412953512','Pong','Kung','hjkhhkjh','5d349c3a-cdbd-44b0-b3ac-bc41793bbe86');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-12  0:13:55
