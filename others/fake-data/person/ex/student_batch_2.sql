-- Insert Student data for SSB System - Batch 2 (50 students)
-- Database: SSB
-- Link Person to Student table, each student has 1 parent (continued)

USE `SSB`;

INSERT INTO `Student` (`student_parent_id`, `student_person_id`, `student_grade`) VALUES
-- Batch 2: Students 51-100 (person_id 161-210), Parents 61-110
(61, 161, 8),   -- Child of parent 61
(62, 162, 4),   -- Child of parent 62
(63, 163, 6),   -- Child of parent 63
(64, 164, 10),  -- Child of parent 64
(65, 165, 3),   -- Child of parent 65
(66, 166, 7),   -- Child of parent 66
(67, 167, 5),   -- Child of parent 67
(68, 168, 2),   -- Child of parent 68
(69, 169, 9),   -- Child of parent 69
(70, 170, 6),   -- Child of parent 70

(71, 171, 11),  -- Child of parent 71
(72, 172, 4),   -- Child of parent 72
(73, 173, 8),   -- Child of parent 73
(74, 174, 5),   -- Child of parent 74
(75, 175, 3),   -- Child of parent 75
(76, 176, 7),   -- Child of parent 76
(77, 177, 6),   -- Child of parent 77
(78, 178, 2),   -- Child of parent 78
(79, 179, 12),  -- Child of parent 79
(80, 180, 5),   -- Child of parent 80

(81, 181, 9),   -- Child of parent 81
(82, 182, 4),   -- Child of parent 82
(83, 183, 6),   -- Child of parent 83
(84, 184, 10),  -- Child of parent 84
(85, 185, 3),   -- Child of parent 85
(86, 186, 7),   -- Child of parent 86
(87, 187, 5),   -- Child of parent 87
(88, 188, 2),   -- Child of parent 88
(89, 189, 11),  -- Child of parent 89
(90, 190, 6),   -- Child of parent 90

(91, 191, 8),   -- Child of parent 91
(92, 192, 4),   -- Child of parent 92
(93, 193, 7),   -- Child of parent 93
(94, 194, 5),   -- Child of parent 94
(95, 195, 3),   -- Child of parent 95
(96, 196, 9),   -- Child of parent 96
(97, 197, 6),   -- Child of parent 97
(98, 198, 2),   -- Child of parent 98
(99, 199, 10),  -- Child of parent 99
(100, 200, 5),  -- Child of parent 100

(101, 201, 12), -- Child of parent 101
(102, 202, 4),  -- Child of parent 102
(103, 203, 7),  -- Child of parent 103
(104, 204, 6),  -- Child of parent 104
(105, 205, 3),  -- Child of parent 105
(106, 206, 8),  -- Child of parent 106
(107, 207, 5),  -- Child of parent 107
(108, 208, 2),  -- Child of parent 108
(109, 209, 11), -- Child of parent 109
(110, 210, 6);  -- Child of parent 110

-- Summary: 50 Student records (Batch 2)
-- Total Students: 100 (50 from batch 1 + 50 from batch 2)
-- student_id: auto-increment (51-100)
-- student_parent_id: 61-110
-- student_person_id: 161-210
-- student_grade: mix of grades 2-12
-- Each parent has exactly 1 child
-- All linked to Person and Parent tables

-- NOTE: Make sure to verify actual person_id values after running person files
-- The person_id values assume:
--   - 10 drivers (person_id 1-10)
--   - 100 parents (person_id 11-110)
--   - 100 students (person_id 111-210)
