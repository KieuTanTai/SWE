-- Insert Person data for SSB System - Part 2: Parents Batch 1 (50 persons)
-- Database: SSB
-- Person for parents with accounts

USE `SSB`;

INSERT INTO `Person` (`person_account_id`, `person_phone`, `person_name`, `person_gender`, `person_birthday`, `person_type`, `person_life_cycle_status`) VALUES
-- Parents from dump (account_id: 6-12, 16-18) - 10 parents
(6, '0912345601', 'Nguyễn Thị Lan', 0, '1982-05-10', 'parent', 1),
(7, '0912345602', 'Trần Văn Hùng', 1, '1980-08-15', 'parent', 1),
(8, '0912345603', 'Lê Thị Hoa', 0, '1985-03-20', 'parent', 1),
(9, '0912345604', 'Phạm Minh Tuấn', 1, '1983-11-25', 'parent', 1),
(10, '0912345605', 'Hoàng Thị Mai', 0, '1987-07-30', 'parent', 1),
(11, '0912345606', 'Võ Văn Nam', 1, '1981-12-05', 'parent', 1),
(12, '0912345607', 'Đặng Thị Thanh', 0, '1986-09-18', 'parent', 1),
(16, '0912345608', 'Bùi Văn Đức', 1, '1984-04-22', 'parent', 1),
(17, '0912345609', 'Phan Thị Ngọc', 0, '1988-06-14', 'parent', 1),
(18, '0912345610', 'Trịnh Văn Quang', 1, '1982-10-08', 'parent', 1),

-- New Parents Batch 1 (account_id: 53-92) - 40 parents
(53, '0912345611', 'Nguyễn Thị Hương', 0, '1985-01-15', 'parent', 1),
(54, '0912345612', 'Trần Văn Bình', 1, '1983-03-22', 'parent', 1),
(55, '0912345613', 'Lê Thị Dung', 0, '1986-05-18', 'parent', 1),
(56, '0912345614', 'Phạm Văn Cường', 1, '1984-07-25', 'parent', 1),
(57, '0912345615', 'Hoàng Thị Linh', 0, '1987-09-30', 'parent', 1),
(58, '0912345616', 'Võ Văn Tân', 1, '1982-11-12', 'parent', 1),
(59, '0912345617', 'Đặng Thị Kim', 0, '1988-02-08', 'parent', 1),
(60, '0912345618', 'Bùi Văn Phúc', 1, '1981-04-19', 'parent', 1),
(61, '0912345619', 'Phan Thị Trang', 0, '1985-06-27', 'parent', 1),
(62, '0912345620', 'Trịnh Văn Đạt', 1, '1983-08-14', 'parent', 1),
(63, '0912345621', 'Nguyễn Thị Nga', 0, '1986-10-20', 'parent', 1),
(64, '0912345622', 'Trần Văn Thắng', 1, '1984-12-05', 'parent', 1),
(65, '0912345623', 'Lê Thị Phương', 0, '1987-01-28', 'parent', 1),
(66, '0912345624', 'Phạm Văn Hiếu', 1, '1982-03-16', 'parent', 1),
(67, '0912345625', 'Hoàng Thị Tâm', 0, '1988-05-11', 'parent', 1),
(68, '0912345626', 'Võ Văn Khoa', 1, '1981-07-23', 'parent', 1),
(69, '0912345627', 'Đặng Thị Nhung', 0, '1985-09-17', 'parent', 1),
(70, '0912345628', 'Bùi Văn Hải', 1, '1983-11-09', 'parent', 1),
(71, '0912345629', 'Phan Thị Yến', 0, '1986-02-24', 'parent', 1),
(72, '0912345630', 'Trịnh Văn Toàn', 1, '1984-04-30', 'parent', 1),
(73, '0912345631', 'Nguyễn Thị Tuyết', 0, '1987-06-15', 'parent', 1),
(74, '0912345632', 'Trần Văn Sơn', 1, '1982-08-21', 'parent', 1),
(75, '0912345633', 'Lê Thị Hằng', 0, '1988-10-07', 'parent', 1),
(76, '0912345634', 'Phạm Văn Lâm', 1, '1981-12-13', 'parent', 1),
(77, '0912345635', 'Hoàng Thị Vân', 0, '1985-03-19', 'parent', 1),
(78, '0912345636', 'Võ Văn Dũng', 1, '1983-05-26', 'parent', 1),
(79, '0912345637', 'Đặng Thị Xuân', 0, '1986-07-31', 'parent', 1),
(80, '0912345638', 'Bùi Văn Tú', 1, '1984-09-12', 'parent', 1),
(81, '0912345639', 'Phan Thị Diệu', 0, '1987-11-18', 'parent', 1),
(82, '0912345640', 'Trịnh Văn Trung', 1, '1982-01-24', 'parent', 1),
(83, '0912345641', 'Nguyễn Thị Thu', 0, '1988-04-29', 'parent', 1),
(84, '0912345642', 'Trần Văn Vinh', 1, '1981-06-16', 'parent', 1),
(85, '0912345643', 'Lê Thị Loan', 0, '1985-08-22', 'parent', 1),
(86, '0912345644', 'Phạm Văn Khánh', 1, '1983-10-28', 'parent', 1),
(87, '0912345645', 'Hoàng Thị Bích', 0, '1986-12-04', 'parent', 1),
(88, '0912345646', 'Võ Văn Thành', 1, '1984-02-10', 'parent', 1),
(89, '0912345647', 'Đặng Thị Hạnh', 0, '1987-04-16', 'parent', 1),
(90, '0912345648', 'Bùi Văn Kiên', 1, '1982-06-22', 'parent', 1),
(91, '0912345649', 'Phan Thị Ly', 0, '1988-08-28', 'parent', 1),
(92, '0912345650', 'Trịnh Văn Phong', 1, '1981-10-14', 'parent', 1);

-- Summary: 50 Parent persons (Batch 1)
-- Mix of male (1) and female (0)
-- Birth years: 1981-1988
-- All have accounts and phone numbers
