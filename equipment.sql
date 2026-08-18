-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for equipment
CREATE DATABASE IF NOT EXISTS `equipment` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `equipment`;

-- Dumping structure for table equipment.approval_history
DROP TABLE IF EXISTS `approval_history`;
CREATE TABLE IF NOT EXISTS `approval_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maintenance_id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` enum('SUPERVISOR','MANAGER') NOT NULL,
  `action` enum('APPROVED','REJECTED') NOT NULL,
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `maintenance_id` (`maintenance_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `approval_history_ibfk_1` FOREIGN KEY (`maintenance_id`) REFERENCES `maintenance_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `approval_history_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table equipment.approval_history: ~0 rows (approximately)

-- Dumping structure for table equipment.equipment
DROP TABLE IF EXISTS `equipment`;
CREATE TABLE IF NOT EXISTS `equipment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipment_code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `location` varchar(150) NOT NULL,
  `description` text,
  `status` enum('ACTIVE','MAINTENANCE','INACTIVE') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `equipment_code` (`equipment_code`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table equipment.equipment: ~5 rows (approximately)
REPLACE INTO `equipment` (`id`, `equipment_code`, `name`, `location`, `description`, `status`, `created_at`, `updated_at`) VALUES
	(2, 'EQ-002', 'Generator 01', 'Basement', 'Generator listrik utama', 'ACTIVE', '2026-08-11 13:52:08', '2026-08-11 13:52:08'),
	(3, 'EQ-003', 'Compressor 01', 'Workshop', 'Compressor untuk kebutuhan workshop', 'ACTIVE', '2026-08-11 13:52:08', '2026-08-11 13:52:08'),
	(4, 'EQ-004', 'AC Unit 02', 'Ruang Meeting', 'AC ruang meeting', 'ACTIVE', '2026-08-11 13:52:08', '2026-08-11 13:52:08'),
	(5, 'EQ-005', 'Generator 02', 'Area Produksi', 'Generator cadangan', 'ACTIVE', '2026-08-11 13:52:08', '2026-08-11 13:52:08'),
	(28, 'da011', 'ddsadassd333', 'BANDUNG', 'dasdasd', 'ACTIVE', '2026-08-14 11:21:32', '2026-08-14 11:21:32');

-- Dumping structure for table equipment.maintenance_history
DROP TABLE IF EXISTS `maintenance_history`;
CREATE TABLE IF NOT EXISTS `maintenance_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maintenance_id` int NOT NULL,
  `equipment_id` int NOT NULL,
  `engineer_id` int NOT NULL,
  `action` text NOT NULL,
  `result` text NOT NULL,
  `completed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `maintenance_id` (`maintenance_id`),
  KEY `equipment_id` (`equipment_id`),
  KEY `engineer_id` (`engineer_id`),
  CONSTRAINT `maintenance_history_ibfk_1` FOREIGN KEY (`maintenance_id`) REFERENCES `maintenance_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `maintenance_history_ibfk_2` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE,
  CONSTRAINT `maintenance_history_ibfk_3` FOREIGN KEY (`engineer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table equipment.maintenance_history: ~0 rows (approximately)
REPLACE INTO `maintenance_history` (`id`, `maintenance_id`, `equipment_id`, `engineer_id`, `action`, `result`, `completed_at`) VALUES
	(1, 2, 2, 1, 'APPROVE', 'Maintenance request disetujui Supervisor', '2026-08-18 07:41:25');

-- Dumping structure for table equipment.maintenance_requests
DROP TABLE IF EXISTS `maintenance_requests`;
CREATE TABLE IF NOT EXISTS `maintenance_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipment_id` int NOT NULL,
  `engineer_id` int NOT NULL,
  `description` text NOT NULL,
  `priority` enum('LOW','MEDIUM','HIGH') DEFAULT 'MEDIUM',
  `status` enum('PENDING_SUPERVISOR','PENDING_MANAGER','REJECTED','APPROVED','IN_PROGRESS','COMPLETED') DEFAULT 'PENDING_SUPERVISOR',
  `supervisor_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `rejection_reason` text,
  `maintenance_result` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `equipment_id` (`equipment_id`),
  KEY `engineer_id` (`engineer_id`),
  KEY `supervisor_id` (`supervisor_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `maintenance_requests_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE,
  CONSTRAINT `maintenance_requests_ibfk_2` FOREIGN KEY (`engineer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `maintenance_requests_ibfk_3` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `maintenance_requests_ibfk_4` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table equipment.maintenance_requests: ~1 rows (approximately)
REPLACE INTO `maintenance_requests` (`id`, `equipment_id`, `engineer_id`, `description`, `priority`, `status`, `supervisor_id`, `manager_id`, `rejection_reason`, `maintenance_result`, `created_at`, `updated_at`) VALUES
	(1, 2, 1, 'Kerusakan', 'MEDIUM', 'PENDING_SUPERVISOR', NULL, NULL, NULL, NULL, '2026-08-14 09:44:24', '2026-08-14 09:44:24'),
	(2, 2, 1, 'kama', 'LOW', 'APPROVED', NULL, NULL, NULL, NULL, '2026-08-18 06:43:15', '2026-08-18 07:41:25');

-- Dumping structure for table equipment.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ENGINEER','SUPERVISOR','MANAGER','ADMIN') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table equipment.users: ~8 rows (approximately)
REPLACE INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
	(1, 'opik', 'opik@gmail.com', '123', 'ADMIN', '2026-08-11 13:48:41'),
	(2, 'farid', 'farid@gmail.com', '122', 'ENGINEER', '2026-08-11 13:49:19'),
	(3, 'gani', 'gani@gmail.com', '121', 'SUPERVISOR', '2026-08-11 13:49:56'),
	(4, 'nanda', 'nanda@gmail.com', '1112', 'MANAGER', '2026-08-11 13:50:29'),
	(5, 'admin', 'admin@maintenx.com', '$2b$10$UUXcA.YvL0iRxcrjpTeYses2LS1l2O.wnrlU1zcDg0Z4FO/DI0EGe', 'ADMIN', '2026-08-14 10:56:23'),
	(6, 'engineer', 'engineer@maintenx.com', '$2b$10$T/zuc852AgkJ1RhymsicYe9TOSnySF1GUYKyx5xaHbOKRDKlN2Rwq', 'ENGINEER', '2026-08-14 10:56:23'),
	(7, 'supervisor', 'supervisor@maintenx.com', '$2b$10$cld2U.44AA2keJ/iREpC4OKMF.kzdaObAgpQ6Zx7ZRf2nKDUT0Blq', 'SUPERVISOR', '2026-08-14 10:56:24'),
	(8, 'manager', 'manager@maintenx.com', '$2b$10$U59nifEpHucmBPd0/HM9Hu42VA3eeC7ljd/pI1IKpGI4EQs1sCkNi', 'MANAGER', '2026-08-14 10:56:24');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
