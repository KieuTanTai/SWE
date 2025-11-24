-- Insert Bus data for SSB System (10 records)
-- Database: SSB
USE `SSB`;

INSERT INTO `Bus` (
  `bus_license_plate`, `bus_brand`, `bus_model`, `bus_capacity`, `bus_year_manufactured`, `bus_has_wifi`, `bus_has_camera`, `bus_color`, `bus_status`
) VALUES
('51B-12345', 'Hyundai', 'County', 29, 2018, TRUE, TRUE, 'Vàng', TRUE),
('51B-23456', 'Thaco', 'BlueSky', 35, 2019, TRUE, FALSE, 'Trắng', TRUE),
('51B-34567', 'Samco', 'Felix', 29, 2017, FALSE, TRUE, 'Xanh', TRUE),
('51B-45678', 'Isuzu', 'Samurai', 16, 2020, TRUE, TRUE, 'Đỏ', TRUE),
('51B-56789', 'Ford', 'Transit', 16, 2016, FALSE, FALSE, 'Bạc', TRUE),
('51B-67890', 'Toyota', 'Coaster', 30, 2015, TRUE, FALSE, 'Xám', TRUE),
('51B-78901', 'Mercedes', 'Sprinter', 16, 2018, FALSE, TRUE, 'Đen', TRUE),
('51B-89012', 'Kia', 'Granbird', 45, 2021, TRUE, TRUE, 'Xanh lá', TRUE),
('51B-90123', 'Fuso', 'Rosa', 29, 2017, FALSE, FALSE, 'Cam', TRUE),
('51B-01234', 'Hino', 'Liesse', 24, 2019, TRUE, FALSE, 'Trắng', TRUE);
-- 10 bus records, unique license plates, đa dạng hãng, model, màu sắc, wifi/camera
