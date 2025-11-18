-- Insert Bus_Route data for SSB System (10 bus, 15 route)
USE `SSB`;

INSERT INTO `Bus_Route` (`route_id`, `bus_id`, `bus_route_status`) VALUES
(1, 1, TRUE),
(2, 2, TRUE),
(3, 3, TRUE),
(4, 4, TRUE),
(5, 5, TRUE),
(6, 6, TRUE),
(7, 7, TRUE),
(8, 8, TRUE),
(9, 9, TRUE),
(10, 10, TRUE),
(11, 1, TRUE),
(12, 2, TRUE),
(13, 3, TRUE),
(14, 4, TRUE),
(15, 5, TRUE);
-- 15 bus_route records, mỗi bus có thể chạy nhiều route, mỗi route có ít nhất 1 bus
