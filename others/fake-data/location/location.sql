use `food_and_drink_shop`;

INSERT INTO `location` (
    `location_type_id`,
    `location_house_number`,
    `location_street`,
    `location_ward_id`,
    `location_district_id`,
    `location_city_id`,
    `location_phone`,
    `location_email`,
    `location_name`,
    `location_status`
)
VALUES
-- ================== TP. HỒ CHÍ MINH ==================
(1, '123', 'Nguyễn Huệ', 1, 32, 2, '0281111001', 'store.benne.hcm@foodshop.com', 'Cửa hàng HCM - Quận 1 - Bến Nghé', 1),
(2, '234', 'Lê Thánh Tôn', 2, 32, 2, '0281111002', 'warehouse.benthanh.hcm@foodshop.com', 'Kho HCM - Quận 1 - Bến Thành', 1),
(3, '456', 'Nam Kỳ Khởi Nghĩa', 10, 32, 2, '0281111003', 'office.tandinh.hcm@foodshop.com', 'Văn phòng HCM - Quận 1 - Tân Định', 1),
(4, '321', 'Phan Xích Long', 144, 42, 2, '0281111004', 'distrib.pxlong.hcm@foodshop.com', 'Trung tâm phân phối HCM - Bình Thạnh - Phường 1', 1),
(5, '654', 'D2', 145, 42, 2, '0281111005', 'company.p2.hcm@foodshop.com', 'Công ty cung cấp HCM - Bình Thạnh - Phường 2', 1),
(6, '789', 'Phạm Văn Đồng', 146, 42, 2, '0281111006', 'supplier.p3.hcm@foodshop.com', 'Kho nhà cung cấp HCM - Bình Thạnh - Phường 3', 1),
(1, '111', 'Nguyễn Oanh', 164, 44, 2, '0281111007', 'store.p1.gv@foodshop.com', 'Cửa hàng HCM - Gò Vấp - Phường 1', 1),
(2, '112', 'Lê Đức Thọ', 165, 44, 2, '0281111008', 'warehouse.p3.gv@foodshop.com', 'Kho HCM - Gò Vấp - Phường 3', 1),
(3, '113', 'Quang Trung', 166, 44, 2, '0281111009', 'office.p4.gv@foodshop.com', 'Văn phòng HCM - Gò Vấp - Phường 4', 1),

-- ================== HÀ NỘI ==================
(1, '222', 'Nguyễn Chí Thanh', 1, 1, 1, '0241234001', 'store.phucxa.hn@foodshop.com', 'Cửa hàng HN - Ba Đình - Phúc Xá', 1),
(2, '223', 'Trúc Bạch', 2, 1, 1, '0241234002', 'warehouse.trucbach.hn@foodshop.com', 'Kho HN - Ba Đình - Trúc Bạch', 1),
(3, '224', 'Kim Mã', 12, 1, 1, '0241234003', 'office.kimma.hn@foodshop.com', 'Văn phòng HN - Ba Đình - Kim Mã', 1),
(4, '225', 'Giảng Võ', 13, 1, 1, '0241234004', 'distrib.giangvo.hn@foodshop.com', 'Trung tâm phân phối HN - Ba Đình - Giảng Võ', 1),
(5, '226', 'Hàng Đào', 19, 2, 1, '0241234005', 'company.hangdao.hn@foodshop.com', 'Công ty cung cấp HN - Hoàn Kiếm - Hàng Đào', 1),
(6, '227', 'Hàng Gai', 24, 2, 1, '0241234006', 'supplier.hanggai.hn@foodshop.com', 'Kho nhà cung cấp HN - Hoàn Kiếm - Hàng Gai', 1),
(1, '228', 'Chương Dương', 25, 2, 1, '0241234007', 'store.chuongduong.hn@foodshop.com', 'Cửa hàng HN - Hoàn Kiếm - Chương Dương', 1),
(2, '229', 'Trần Hưng Đạo', 30, 2, 1, '0241234008', 'warehouse.tranhungdao.hn@foodshop.com', 'Kho HN - Hoàn Kiếm - Trần Hưng Đạo', 1),
(3, '230', 'Vĩnh Tuy', 41, 3, 1, '0241234009', 'office.vinhtuy.hn@foodshop.com', 'Văn phòng HN - Hai Bà Trưng - Vĩnh Tuy', 1),

-- ================== ĐÀ NẴNG ==================
(1, '333', 'Hải Phòng', 315, 53, 3, '0236111301', 'store.haiphong.dn@foodshop.com', 'Cửa hàng ĐN - Hải Châu - Hải Châu I', 1),
(2, '334', 'Lê Duẩn', 333, 54, 3, '0236111302', 'warehouse.leduan.dn@foodshop.com', 'Kho ĐN - Thanh Khê - Thanh Khê Đông', 1),
(3, '335', 'Phạm Văn Đồng', 325, 55, 3, '0236111303', 'office.phamvandong.dn@foodshop.com', 'Văn phòng ĐN - Sơn Trà - An Hải Bắc', 1),
(4, '336', 'Nguyễn Tất Thành', 342, 57, 3, '0236111304', 'distrib.hoakhankhanh.dn@foodshop.com', 'Trung tâm phân phối ĐN - Liên Chiểu - Hòa Khánh Bắc', 1),
(5, '337', 'Khuê Mỹ', 346, 56, 3, '0236111305', 'company.khuemy.dn@foodshop.com', 'Công ty cung cấp ĐN - Ngũ Hành Sơn - Khuê Mỹ', 1),
(6, '338', 'Thanh Khê Tây', 334, 54, 3, '0236111306', 'supplier.thanhkhetay.dn@foodshop.com', 'Kho nhà cung cấp ĐN - Thanh Khê - Thanh Khê Tây', 1),
(1, '339', 'An Hải Đông', 326, 55, 3, '0236111307', 'store.anhaidong.dn@foodshop.com', 'Cửa hàng ĐN - Sơn Trà - An Hải Đông', 1),
(2, '340', 'Bình Thuận', 320, 53, 3, '0236111308', 'warehouse.binhthuan.dn@foodshop.com', 'Kho ĐN - Hải Châu - Bình Thuận', 1),
(3, '341', 'Hòa Quý', 347, 56, 3, '0236111309', 'office.hoaquy.dn@foodshop.com', 'Văn phòng ĐN - Ngũ Hành Sơn - Hòa Quý', 1);

SELECT * FROM `location`;