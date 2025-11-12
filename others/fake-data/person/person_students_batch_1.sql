-- Insert Person data for SSB System - Part 3: Students Batch 1 (50 persons)
-- Database: SSB
-- Person for students WITHOUT accounts

USE `SSB`;

INSERT INTO `Person` (`person_account_id`, `person_phone`, `person_name`, `person_gender`, `person_birthday`, `person_type`, `person_life_cycle_status`) VALUES
-- Students (no account_id, NULL for person_account_id) - Batch 1: 50 students
(NULL, '0923456701', 'Nguyễn Văn An', 1, '2012-03-15', 'student', 1),
(NULL, '0923456702', 'Trần Thị Bảo', 0, '2013-05-20', 'student', 1),
(NULL, '0923456703', 'Lê Văn Cường', 1, '2011-08-10', 'student', 1),
(NULL, '0923456704', 'Phạm Thị Dung', 0, '2014-02-28', 'student', 1),
(NULL, '0923456705', 'Hoàng Văn Em', 1, '2012-11-05', 'student', 1),
(NULL, '0923456706', 'Võ Thị Giang', 0, '2013-07-18', 'student', 1),
(NULL, '0923456707', 'Đặng Văn Hải', 1, '2011-04-22', 'student', 1),
(NULL, '0923456708', 'Bùi Thị Hoa', 0, '2014-09-14', 'student', 1),
(NULL, '0923456709', 'Phan Văn Khang', 1, '2012-06-30', 'student', 1),
(NULL, '0923456710', 'Trịnh Thị Lan', 0, '2013-12-08', 'student', 1),
(NULL, '0923456711', 'Nguyễn Văn Long', 1, '2011-01-25', 'student', 1),
(NULL, '0923456712', 'Trần Thị Mai', 0, '2014-05-17', 'student', 1),
(NULL, '0923456713', 'Lê Văn Nam', 1, '2012-10-03', 'student', 1),
(NULL, '0923456714', 'Phạm Thị Nga', 0, '2013-03-29', 'student', 1),
(NULL, '0923456715', 'Hoàng Văn Phúc', 1, '2011-09-12', 'student', 1),
(NULL, '0923456716', 'Võ Thị Quỳnh', 0, '2014-01-06', 'student', 1),
(NULL, '0923456717', 'Đặng Văn Sơn', 1, '2012-07-24', 'student', 1),
(NULL, '0923456718', 'Bùi Thị Tâm', 0, '2013-11-18', 'student', 1),
(NULL, '0923456719', 'Phan Văn Tùng', 1, '2011-05-09', 'student', 1),
(NULL, '0923456720', 'Trịnh Thị Uyên', 0, '2014-08-21', 'student', 1),
(NULL, '0923456721', 'Nguyễn Văn Việt', 1, '2012-02-14', 'student', 1),
(NULL, '0923456722', 'Trần Thị Xuân', 0, '2013-06-27', 'student', 1),
(NULL, '0923456723', 'Lê Văn Yên', 1, '2011-12-19', 'student', 1),
(NULL, '0923456724', 'Phạm Thị Anh', 0, '2014-04-03', 'student', 1),
(NULL, '0923456725', 'Hoàng Văn Bình', 1, '2012-09-28', 'student', 1),
(NULL, '0923456726', 'Võ Thị Châu', 0, '2013-01-15', 'student', 1),
(NULL, '0923456727', 'Đặng Văn Dũng', 1, '2011-07-11', 'student', 1),
(NULL, '0923456728', 'Bùi Thị Đào', 0, '2014-11-25', 'student', 1),
(NULL, '0923456729', 'Phan Văn Giáp', 1, '2012-04-18', 'student', 1),
(NULL, '0923456730', 'Trịnh Thị Hạnh', 0, '2013-08-09', 'student', 1),
(NULL, '0923456731', 'Nguyễn Văn Hiếu', 1, '2011-02-02', 'student', 1),
(NULL, '0923456732', 'Trần Thị Huyền', 0, '2014-06-16', 'student', 1),
(NULL, '0923456733', 'Lê Văn Khánh', 1, '2012-12-11', 'student', 1),
(NULL, '0923456734', 'Phạm Thị Linh', 0, '2013-04-26', 'student', 1),
(NULL, '0923456735', 'Hoàng Văn Minh', 1, '2011-10-20', 'student', 1),
(NULL, '0923456736', 'Võ Thị Ngọc', 0, '2014-02-12', 'student', 1),
(NULL, '0923456737', 'Đặng Văn Phong', 1, '2012-08-07', 'student', 1),
(NULL, '0923456738', 'Bùi Thị Phương', 0, '2013-12-31', 'student', 1),
(NULL, '0923456739', 'Phan Văn Quân', 1, '2011-06-24', 'student', 1),
(NULL, '0923456740', 'Trịnh Thị Thảo', 0, '2014-10-18', 'student', 1),
(NULL, '0923456741', 'Nguyễn Văn Thắng', 1, '2012-03-13', 'student', 1),
(NULL, '0923456742', 'Trần Thị Thu', 0, '2013-07-05', 'student', 1),
(NULL, '0923456743', 'Lê Văn Toàn', 1, '2011-11-28', 'student', 1),
(NULL, '0923456744', 'Phạm Thị Trang', 0, '2014-03-22', 'student', 1),
(NULL, '0923456745', 'Hoàng Văn Trung', 1, '2012-09-15', 'student', 1),
(NULL, '0923456746', 'Võ Thị Tuyết', 0, '2013-01-09', 'student', 1),
(NULL, '0923456747', 'Đặng Văn Vũ', 1, '2011-05-03', 'student', 1),
(NULL, '0923456748', 'Bùi Thị Vân', 0, '2014-08-27', 'student', 1),
(NULL, '0923456749', 'Phan Văn Xuân', 1, '2012-02-20', 'student', 1),
(NULL, '0923456750', 'Trịnh Thị Yến', 0, '2013-06-14', 'student', 1);

-- Summary: 50 Student persons (Batch 1)
-- NO account_id (students don't have accounts)
-- Mix of male (1) and female (0)
-- Birth years: 2011-2014 (ages 10-13)
-- All have phone numbers
-- All person_type = 'student' for trigger validation
