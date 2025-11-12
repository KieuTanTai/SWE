-- Insert Address data for SSB System - Batch 1 (50 addresses)
-- Database: SSB
-- Address for Parent table only

USE `SSB`;

INSERT INTO `Address` (`address_city_id`, `address_district_id`, `address_ward_id`, `address_number`) VALUES
-- 100 addresses for 100 parents
-- Using common Vietnamese cities, districts, and wards
-- Format: city_id, district_id, ward_id, address_number

-- Batch 1: Addresses 1-50
-- Hồ Chí Minh City (city_id: 1)
(1, 1, 1, '123 Nguyễn Huệ'),
(1, 1, 2, '45 Lê Lợi'),
(1, 2, 3, '67 Trần Hưng Đạo'),
(1, 2, 4, '89 Hai Bà Trưng'),
(1, 3, 5, '12 Điện Biên Phủ'),
(1, 3, 6, '34 Nam Kỳ Khởi Nghĩa'),
(1, 4, 7, '56 Lý Thường Kiệt'),
(1, 4, 8, '78 Phan Đăng Lưu'),
(1, 5, 9, '90 Cách Mạng Tháng Tám'),
(1, 5, 10, '111 Võ Văn Tần'),

-- Hà Nội (city_id: 2)
(2, 6, 11, '22 Hàng Bài'),
(2, 6, 12, '44 Hàng Gai'),
(2, 7, 13, '66 Phố Huế'),
(2, 7, 14, '88 Trần Nhân Tông'),
(2, 8, 15, '100 Láng Hạ'),
(2, 8, 16, '122 Giảng Võ'),
(2, 9, 17, '144 Cầu Giấy'),
(2, 9, 18, '166 Nguyễn Thái Học'),
(2, 10, 19, '188 Hoàng Quốc Việt'),
(2, 10, 20, '200 Xuân Thủy'),

-- Đà Nẵng (city_id: 3)
(3, 11, 21, '25 Bạch Đằng'),
(3, 11, 22, '47 Trần Phú'),
(3, 12, 23, '69 Lê Duẩn'),
(3, 12, 24, '91 Ngô Quyền'),
(3, 13, 25, '13 Nguyễn Văn Linh'),
(3, 13, 26, '35 Điện Biên Phủ'),
(3, 14, 27, '57 Hùng Vương'),
(3, 14, 28, '79 Phan Châu Trinh'),

-- Hồ Chí Minh City (continued)
(1, 6, 29, '101 Cộng Hòa'),
(1, 6, 30, '123 Tân Sơn Nhì'),
(1, 7, 31, '145 Âu Cơ'),
(1, 7, 32, '167 Lạc Long Quân'),
(1, 8, 33, '189 Hoàng Văn Thụ'),
(1, 8, 34, '211 Phan Xích Long'),
(1, 9, 35, '233 Trường Chinh'),
(1, 9, 36, '255 Xô Viết Nghệ Tĩnh'),
(1, 10, 37, '277 Lê Văn Việt'),
(1, 10, 38, '299 Phạm Văn Đồng'),

-- Hà Nội (continued)
(2, 11, 39, '32 Kim Mã'),
(2, 11, 40, '54 Nguyễn Chí Thanh'),
(2, 12, 41, '76 Trường Chinh'),
(2, 12, 42, '98 Giải Phóng'),
(2, 13, 43, '120 Đại Cồ Việt'),
(2, 13, 44, '142 Lê Thanh Nghị'),
(2, 14, 45, '164 Minh Khai'),
(2, 14, 46, '186 Vĩnh Tuy'),
(2, 15, 47, '208 Ngọc Hồi'),
(2, 15, 48, '230 Ngọc Lâm'),

-- Cần Thơ (city_id: 4)
(4, 16, 49, '15 Trần Hưng Đạo'),
(4, 16, 50, '37 Mậu Thân');

-- Summary: 50 Address records (Batch 1)
-- address_id: 1-50 (auto-increment)
-- Cities: HCM (1), Hanoi (2), Da Nang (3), Can Tho (4)
-- Each address has city, district, ward, and street number
-- Will be linked to Parent table via parent_address_id
