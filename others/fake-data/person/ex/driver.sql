-- Insert Driver data for SSB System
-- Database: SSB
-- Link Person to Driver table

USE `SSB`;

INSERT INTO `Driver` (`driver_person_id`, `driver_experience`, `driver_experience_type`, `driver_late_arrival_count`) VALUES
-- 10 drivers with their person_id (auto-increment from Person table)
-- Assuming person_id starts from 1 for drivers (adjust based on actual person_id values)
-- You may need to check actual person_id values after inserting Person data

-- Driver 1-10 (person_id will be sequential based on Person insert order)
-- Format: driver_person_id, experience (1-15 years), type (year), late_count (0-3)
(1, 5.5, 'year', 0),   -- Nguyễn Văn Tài (account 13)
(2, 8.0, 'year', 1),   -- Trần Minh Tuấn (account 14)
(3, 3.5, 'year', 0),   -- Lê Hoàng Anh (account 15)
(4, 10.0, 'year', 2),  -- Phạm Quốc Hùng (account 19)
(5, 6.5, 'year', 0),   -- Võ Thanh Tùng (account 20)
(6, 4.0, 'year', 1),   -- Nguyễn Văn Long (account 23)
(7, 7.5, 'year', 0),   -- Trần Văn Minh (account 24)
(8, 9.0, 'year', 1),   -- Lê Văn Hùng (account 25)
(9, 5.0, 'year', 2),   -- Phạm Văn Đức (account 26)
(10, 12.0, 'year', 3); -- Hoàng Văn Nam (account 27)

-- Summary: 10 Driver records
-- Experience range: 3.5 - 12.0 years
-- Late arrival count: 0-3 times
-- All linked to Person table via driver_person_id (FK to person_id)

-- NOTE: Make sure to verify actual person_id values after running person_drivers.sql
-- The person_id values above assume drivers are the first 10 persons inserted
