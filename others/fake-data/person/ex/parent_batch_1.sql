-- Insert Parent data for SSB System - Batch 1 (50 parents)
-- Database: SSB
-- Link Person to Parent table

USE `SSB`;

INSERT INTO `Parent` (`parent_person_id`, `parent_address_id`, `parent_job`, `parent_type`) VALUES
-- 100 parents with their person_id (auto-increment from Person table)
-- Assuming person_id 11-110 for parents (after 10 drivers)
-- Format: parent_person_id, address_id (1-100), job, parent_type

-- Batch 1: Parents 11-60 (50 parents)
(11, 1, 'Giáo viên', 'mother'),
(12, 2, 'Kỹ sư', 'father'),
(13, 3, 'Y tá', 'mother'),
(14, 4, 'Kinh doanh', 'father'),
(15, 5, 'Nội trợ', 'mother'),
(16, 6, 'Công nhân', 'father'),
(17, 7, 'Nhân viên văn phòng', 'mother'),
(18, 8, 'Tài xế', 'father'),
(19, 9, 'Bác sĩ', 'mother'),
(20, 10, 'Kế toán', 'father'),

(21, 11, 'Giáo viên', 'mother'),
(22, 12, 'Lập trình viên', 'father'),
(23, 13, 'Điều dưỡng', 'mother'),
(24, 14, 'Nhà hàng', 'father'),
(25, 15, 'Nội trợ', 'mother'),
(26, 16, 'Thợ điện', 'father'),
(27, 17, 'Kế toán', 'mother'),
(28, 18, 'Bảo vệ', 'father'),
(29, 19, 'Dược sĩ', 'mother'),
(30, 20, 'Kiến trúc sư', 'father'),

(31, 21, 'Nhân viên ngân hàng', 'mother'),
(32, 22, 'Thợ xây', 'father'),
(33, 23, 'Giáo viên', 'mother'),
(34, 24, 'Cơ khí', 'father'),
(35, 25, 'Nội trợ', 'mother'),
(36, 26, 'Bán hàng', 'father'),
(37, 27, 'Y tá', 'mother'),
(38, 28, 'Lái xe', 'father'),
(39, 29, 'Luật sư', 'mother'),
(40, 30, 'Công nhân', 'father'),

(41, 31, 'Giáo viên', 'mother'),
(42, 32, 'Kỹ sư xây dựng', 'father'),
(43, 33, 'Nhân viên y tế', 'mother'),
(44, 34, 'Buôn bán', 'father'),
(45, 35, 'Nội trợ', 'grandma'),
(46, 36, 'Thợ hồ', 'grandpa'),
(47, 37, 'Nhân viên văn phòng', 'mother'),
(48, 38, 'Tài xế xe khách', 'father'),
(49, 39, 'Bác sĩ', 'mother'),
(50, 40, 'Nhân viên IT', 'father'),

(51, 41, 'Giảng viên', 'mother'),
(52, 42, 'Kỹ sư phần mềm', 'father'),
(53, 43, 'Y tá', 'mother'),
(54, 44, 'Kinh doanh tự do', 'father'),
(55, 45, 'Nội trợ', 'mother'),
(56, 46, 'Thợ điện tử', 'father'),
(57, 47, 'Kế toán trưởng', 'mother'),
(58, 48, 'Nhân viên bảo vệ', 'father'),
(59, 49, 'Dược sĩ', 'mother'),
(60, 50, 'Kiến trúc sư', 'father');

-- Summary: 50 Parent records (Batch 1)
-- parent_person_id: 11-60
-- address_id: 1-50
-- Mix of father/mother/grandpa/grandma
-- Various jobs (teacher, engineer, nurse, etc.)
