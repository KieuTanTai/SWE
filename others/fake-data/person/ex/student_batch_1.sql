-- Insert Student data for SSB System - Batch 1 (50 students)
-- Database: SSB
-- Link Person to Student table, each student has 1 parent

USE `SSB`;

INSERT INTO `Student` (`student_parent_id`, `student_person_id`, `student_grade`) VALUES
-- 100 students with their person_id (auto-increment from Person table)
-- Assuming person_id 111-210 for students (after 10 drivers + 100 parents)
-- Format: student_parent_id (11-110), student_person_id (111-210), grade (1-12)

-- Batch 1: Students 1-50 (person_id 111-160), Parents 11-60
(11, 111, 5),   -- Child of parent 11
(12, 112, 7),   -- Child of parent 12
(13, 113, 3),   -- Child of parent 13
(14, 114, 9),   -- Child of parent 14
(15, 115, 6),   -- Child of parent 15
(16, 116, 4),   -- Child of parent 16
(17, 117, 8),   -- Child of parent 17
(18, 118, 2),   -- Child of parent 18
(19, 119, 10),  -- Child of parent 19
(20, 120, 5),   -- Child of parent 20

(21, 121, 6),   -- Child of parent 21
(22, 122, 11),  -- Child of parent 22
(23, 123, 3),   -- Child of parent 23
(24, 124, 7),   -- Child of parent 24
(25, 125, 4),   -- Child of parent 25
(26, 126, 9),   -- Child of parent 26
(27, 127, 5),   -- Child of parent 27
(28, 128, 2),   -- Child of parent 28
(29, 129, 12),  -- Child of parent 29
(30, 130, 6),   -- Child of parent 30

(31, 131, 8),   -- Child of parent 31
(32, 132, 4),   -- Child of parent 32
(33, 133, 10),  -- Child of parent 33
(34, 134, 5),   -- Child of parent 34
(35, 135, 3),   -- Child of parent 35
(36, 136, 7),   -- Child of parent 36
(37, 137, 6),   -- Child of parent 37
(38, 138, 2),   -- Child of parent 38
(39, 139, 11),  -- Child of parent 39
(40, 140, 5),   -- Child of parent 40

(41, 141, 9),   -- Child of parent 41
(42, 142, 4),   -- Child of parent 42
(43, 143, 7),   -- Child of parent 43
(44, 144, 6),   -- Child of parent 44
(45, 145, 3),   -- Child of parent 45
(46, 146, 8),   -- Child of parent 46
(47, 147, 5),   -- Child of parent 47
(48, 148, 2),   -- Child of parent 48
(49, 149, 10),  -- Child of parent 49
(50, 150, 6),   -- Child of parent 50

(51, 151, 12),  -- Child of parent 51
(52, 152, 4),   -- Child of parent 52
(53, 153, 7),   -- Child of parent 53
(54, 154, 5),   -- Child of parent 54
(55, 155, 3),   -- Child of parent 55
(56, 156, 9),   -- Child of parent 56
(57, 157, 6),   -- Child of parent 57
(58, 158, 2),   -- Child of parent 58
(59, 159, 11),  -- Child of parent 59
(60, 160, 5);   -- Child of parent 60

-- Summary: 50 Student records (Batch 1)
-- student_id: auto-increment (1-50)
-- student_parent_id: 11-60
-- student_person_id: 111-160
-- student_grade: mix of grades 2-12
-- Each parent has exactly 1 child
