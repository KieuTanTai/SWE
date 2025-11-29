
USE SSB;
-- Update Address với dữ liệu mới từ corrected_batch1.json
UPDATE Address SET address_number = '50 Văn Cao' WHERE address_id = 1;
UPDATE Address SET address_number = '13 Phạm Hồng Thái' WHERE address_id = 2;
UPDATE Address SET address_number = '459 Đội Cấn' WHERE address_id = 3;
UPDATE Address SET address_number = '116 Linh Lang' WHERE address_id = 4;
UPDATE Address SET address_number = '19/104' WHERE address_id = 5;
UPDATE Address SET address_number = '9 Liễu Giai' WHERE address_id = 6;
UPDATE Address SET address_number = '2 Hoàng Diệu' WHERE address_id = 7;
UPDATE Address SET address_number = '47 Hoàng Hoa Thám' WHERE address_id = 8;
UPDATE Address SET address_number = '7 Nguyễn Tri Phương' WHERE address_id = 9;
UPDATE Address SET address_number = '45/210/41' WHERE address_id = 10;
UPDATE Address SET address_number = '268 Lý Thường Kiệt Đường Nguyễn Siêu' WHERE address_id = 14;

UPDATE accounts SET password = '$2a$10$4GgH1IaJbeZ414Z98N5SVOJ0.kaT3JrpZZC8lMQ5c58gLrjcHf8Rq'
SHOW CREATE TABLE products;