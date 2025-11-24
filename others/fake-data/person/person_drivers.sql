-- Insert Person data for SSB System - Part 1: Drivers (10 persons)
-- Database: SSB
-- Person for drivers with accounts

USE `SSB`;

INSERT INTO `Person` (`person_account_id`, `person_phone`, `person_name`, `person_gender`, `person_birthday`, `person_type`, `person_life_cycle_status`) VALUES
-- 10 Drivers (account_id: 13-15, 19-20, 23-27)
(13, '0901234501', 'Nguyễn Văn Tài', 1, '1985-03-15', 'driver', 1),
(14, '0901234502', 'Trần Minh Tuấn', 1, '1987-07-22', 'driver', 1),
(15, '0901234503', 'Lê Hoàng Nam', 1, '1990-11-08', 'driver', 1),
(19, '0901234504', 'Phạm Đức Anh', 1, '1988-05-12', 'driver', 1),
(20, '0901234505', 'Võ Minh Quân', 1, '1986-09-20', 'driver', 1),
(23, '0901234506', 'Đặng Văn Hùng', 1, '1989-02-14', 'driver', 1),
(24, '0901234507', 'Bùi Thanh Tùng', 1, '1991-06-30', 'driver', 1),
(25, '0901234508', 'Hoàng Minh Đức', 1, '1984-12-05', 'driver', 1),
(26, '0901234509', 'Phan Văn Long', 1, '1992-04-18', 'driver', 1),
(27, '0901234510', 'Trịnh Quang Hải', 1, '1987-10-25', 'driver', 1);

-- Summary: 10 Driver persons
-- All have accounts and phone numbers
-- All are male (gender = 1)
-- Birth years: 1984-1992
