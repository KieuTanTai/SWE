-- Insert Person data for SSB System - Managers
-- Database: SSB
-- Manager info for testing

USE `SSB`;

INSERT INTO `Person` (`person_account_id`, `person_phone`, `person_name`, `person_gender`, `person_birthday`, `person_type`, `person_life_cycle_status`) VALUES
(201, '0909000001', 'Nguyễn Thị Quản Lý', 0, '1980-01-15', 'manager', 1),
(202, '0909000002', 'Trần Văn Điều Hành', 1, '1978-05-20', 'manager', 1),
(203, '0909000003', 'Lê Thị Giám Sát', 0, '1982-09-10', 'manager', 1),
(204, '0909000004', 'Phạm Quốc Quản Trị', 1, '1985-12-25', 'manager', 1),
(205, '0909000005', 'Hoàng Minh Quản Lý', 1, '1983-03-30', 'manager', 1);
-- 5 manager records, đủ thông tin cơ bản
