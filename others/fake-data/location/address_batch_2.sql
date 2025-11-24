-- Insert Address data for SSB System - Batch 2 (50 addresses)
-- Database: SSB
-- Address for Parent table only (continued)

USE `SSB`;

INSERT INTO `Address` (`address_city_id`, `address_district_id`, `address_ward_id`, `address_number`) VALUES
-- Batch 2: Addresses 51-100

-- Cần Thơ (continued)
(4, 17, 51, '59 Hòa Bình'),
(4, 17, 52, '81 Cách Mạng Tháng Tám'),

-- Hải Phòng (city_id: 5)
(5, 18, 53, '18 Lạch Tray'),
(5, 18, 54, '40 Điện Biên Phủ'),
(5, 19, 55, '62 Lê Lợi'),
(5, 19, 56, '84 Hoàng Văn Thụ'),
(5, 20, 57, '106 Văn Cao'),
(5, 20, 58, '128 Tô Hiệu'),

-- Hồ Chí Minh City (continued)
(1, 11, 59, '321 Quang Trung'),
(1, 11, 60, '343 Tô Hiến Thành'),
(1, 12, 61, '365 Nguyễn Oanh'),
(1, 12, 62, '387 Phan Huy Ích'),
(1, 13, 63, '409 Kha Vạn Cân'),
(1, 13, 64, '431 Đỗ Xuân Hợp'),
(1, 14, 65, '453 Nguyễn Duy Trinh'),
(1, 14, 66, '475 Đỗ Xuân Hợp'),
(1, 15, 67, '497 Võ Chí Công'),
(1, 15, 68, '519 Tân Chánh Hiệp'),

-- Hà Nội (continued)
(2, 16, 69, '252 Phạm Văn Đồng'),
(2, 16, 70, '274 Trần Cung'),
(2, 17, 71, '296 Nguyễn Hoàng'),
(2, 17, 72, '318 Mỹ Đình'),
(2, 18, 73, '340 Phạm Hùng'),
(2, 18, 74, '362 Lê Quang Đạo'),
(2, 19, 75, '384 Hồ Tùng Mậu'),
(2, 19, 76, '406 Đường Láng'),

-- Đà Nẵng (continued)
(3, 15, 77, '101 Lê Đình Lý'),
(3, 15, 78, '123 Núi Thành'),
(3, 16, 79, '145 Tôn Đức Thắng'),
(3, 16, 80, '167 Quang Trung'),

-- Nha Trang (city_id: 6)
(6, 21, 81, '20 Trần Phú'),
(6, 21, 82, '42 Nguyễn Thiện Thuật'),
(6, 22, 83, '64 Lê Thánh Tôn'),
(6, 22, 84, '86 Phan Chu Trinh'),

-- Vũng Tàu (city_id: 7)
(7, 23, 85, '25 Trương Công Định'),
(7, 23, 86, '47 Thùy Vân'),
(7, 24, 87, '69 Hoàng Hoa Thám'),
(7, 24, 88, '91 Phan Bội Châu'),

-- Hồ Chí Minh City (continued)
(1, 16, 89, '541 Lê Văn Khương'),
(1, 16, 90, '563 Lê Trọng Tấn'),
(1, 17, 91, '585 Hồ Học Lãm'),
(1, 17, 92, '607 Tân Kỳ Tân Quý'),

-- Hà Nội (continued)
(2, 20, 93, '428 Tây Sơn'),
(2, 20, 94, '450 Thái Hà'),

-- Đà Lạt (city_id: 8)
(8, 25, 95, '30 Trần Phú'),
(8, 25, 96, '52 Nguyễn Văn Cừ'),
(8, 26, 97, '74 Hai Bà Trưng'),
(8, 26, 98, '96 Lê Hồng Phong'),

-- Quy Nhơn (city_id: 9)
(9, 27, 99, '35 Trần Hưng Đạo'),
(9, 27, 100, '57 Nguyễn Huệ');

-- Summary: 50 Address records (Batch 2)
-- Total Addresses: 100 (50 from batch 1 + 50 from batch 2)
-- address_id: 51-100 (auto-increment)
-- Cities: HCM (1), Hanoi (2), Da Nang (3), Can Tho (4), Hai Phong (5), Nha Trang (6), Vung Tau (7), Da Lat (8), Quy Nhon (9)
-- Each address has city, district, ward, and street number
-- Will be linked to Parent table via parent_address_id
-- Each of 100 parents will have 1 unique address

-- NOTE: Before using these addresses, make sure Location_City, Location_District, 
-- and Location_Ward tables are populated with corresponding IDs (1-27 for cities, 
-- 1-27 for districts, 1-100 for wards)
