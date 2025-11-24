-- Insert Parent data for SSB System - Batch 2 (50 parents)
-- Database: SSB
-- Link Person to Parent table (continued)

USE `SSB`;

INSERT INTO `Parent` (`parent_person_id`, `parent_address_id`, `parent_job`, `parent_type`) VALUES
-- Batch 2: Parents 61-110 (50 parents)
(61, 51, 'Giáo viên tiểu học', 'mother'),
(62, 52, 'Thợ cơ khí', 'father'),
(63, 53, 'Nhân viên y tế', 'mother'),
(64, 54, 'Kinh doanh', 'father'),
(65, 55, 'Nội trợ', 'mother'),
(66, 56, 'Công nhân nhà máy', 'father'),
(67, 57, 'Kế toán', 'mother'),
(68, 58, 'Tài xế', 'father'),
(69, 59, 'Điều dưỡng', 'mother'),
(70, 60, 'Lập trình viên', 'father'),

(71, 61, 'Giáo viên THCS', 'mother'),
(72, 62, 'Kỹ sư điện', 'father'),
(73, 63, 'Y tá trưởng', 'mother'),
(74, 64, 'Chủ quán ăn', 'father'),
(75, 65, 'Nội trợ', 'grandma'),
(76, 66, 'Thợ mộc', 'grandpa'),
(77, 67, 'Nhân viên ngân hàng', 'mother'),
(78, 68, 'Bảo vệ chung cư', 'father'),
(79, 69, 'Dược sĩ', 'mother'),
(80, 70, 'Kiến trúc sư', 'father'),

(81, 71, 'Giáo viên mầm non', 'mother'),
(82, 72, 'Thợ sửa xe', 'father'),
(83, 73, 'Điều dưỡng', 'mother'),
(84, 74, 'Buôn bán', 'father'),
(85, 75, 'Nội trợ', 'mother'),
(86, 76, 'Công nhân xây dựng', 'father'),
(87, 77, 'Kế toán viên', 'mother'),
(88, 78, 'Lái xe taxi', 'father'),
(89, 79, 'Bác sĩ đa khoa', 'mother'),
(90, 80, 'Nhân viên IT', 'father'),

(91, 81, 'Giảng viên đại học', 'mother'),
(92, 82, 'Kỹ sư cơ khí', 'father'),
(93, 83, 'Y tá', 'mother'),
(94, 84, 'Kinh doanh online', 'father'),
(95, 85, 'Nội trợ', 'mother'),
(96, 86, 'Thợ hàn', 'father'),
(97, 87, 'Nhân viên hành chính', 'mother'),
(98, 88, 'Tài xế Grab', 'father'),
(99, 89, 'Dược sĩ', 'mother'),
(100, 90, 'Thiết kế đồ họa', 'father'),

(101, 91, 'Giáo viên tiếng Anh', 'mother'),
(102, 92, 'Kỹ sư phần mềm', 'father'),
(103, 93, 'Điều dưỡng viên', 'mother'),
(104, 94, 'Chủ cửa hàng', 'father'),
(105, 95, 'Nội trợ', 'grandma'),
(106, 96, 'Thợ điện', 'grandpa'),
(107, 97, 'Kế toán trưởng', 'mother'),
(108, 98, 'Bảo vệ', 'father'),
(109, 99, 'Y tá', 'mother'),
(110, 100, 'Kỹ sư xây dựng', 'father');

-- Summary: 50 Parent records (Batch 2)
-- Total Parents: 100 (50 from batch 1 + 50 from batch 2)
-- parent_person_id: 61-110
-- address_id: 51-100
-- Mix of father/mother/grandpa/grandma
-- Various jobs
-- All linked to Person table via parent_person_id (FK to person_id)
-- All have corresponding Address records (address_id 1-100)

-- NOTE: Make sure to verify actual person_id values after running person_parents files
-- The person_id values assume 10 drivers (1-10), then 100 parents (11-110)
