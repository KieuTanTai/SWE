CREATE TABLE `Account` (
  `account_id` integer PRIMARY KEY AUTO_INCREMENT,
  `account_email` varchar(255) UNIQUE NOT NULL,
  `account_password` varchar(255) NOT NULL,
  `account_create_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  `account_last_updated_date` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `account_login_status` boolean DEFAULT FALSE
);

CREATE TABLE `Role` (
  `role_id` integer PRIMARY KEY AUTO_INCREMENT,
  `role_name` varchar(25) NOT NULL,
  `role_created_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  `role_active_status` boolean DEFAULT TRUE
);

CREATE TABLE `Account_Role` (
  `role_id` integer,
  `account_id` integer,
  PRIMARY KEY (`role_id`, `account_id`)
);

CREATE TABLE `Location_City` (
  `location_city_id` integer PRIMARY KEY AUTO_INCREMENT,
  `location_city_name` nvarchar(50) NOT NULL,
  `location_city_status` boolean DEFAULT TRUE
);

CREATE TABLE `Location_District` (
  `location_district_id` integer PRIMARY KEY AUTO_INCREMENT,
  `location_district_name` nvarchar(50) NOT NULL,
  `location_city_id` integer NOT NULL,
  `location_district_status` boolean DEFAULT TRUE
);

CREATE TABLE `Location_Ward` (
  `location_ward_id` integer PRIMARY KEY AUTO_INCREMENT,
  `location_ward_name` nvarchar(50) NOT NULL,
  `location_district_id` integer NOT NULL,
  `location_ward_status` boolean DEFAULT TRUE
);

CREATE TABLE `Address` (
  `address_id` integer PRIMARY KEY AUTO_INCREMENT,
  `address_city_id` integer NOT NULL,
  `address_district_id` integer NOT NULL,
  `address_ward_id` integer NOT NULL,
  `address_number` varchar(50)
);

CREATE TABLE `Route` (
  `route_id` integer PRIMARY KEY AUTO_INCREMENT,
  `route_name` nvarchar(50) NOT NULL,
  `route_status` boolean DEFAULT TRUE
);

CREATE TABLE `Detail_Route` (
  `detail_route_id` integer PRIMARY KEY AUTO_INCREMENT,
  `route_id` integer NOT NULL,
  `detail_route_start_point_id` integer NOT NULL,
  `detail_route_end_point_id` integer NOT NULL,
  `detail_route_distance` float
);

CREATE TABLE `Person` (
  `person_id` integer PRIMARY KEY AUTO_INCREMENT,
  `person_account_id` integer UNIQUE,
  `person_phone` varchar(15),
  `person_name` nvarchar(50) NOT NULL,
  `person_gender` boolean,
  `person_birthday` date,
  `person_type` enum('manager','driver','parent','student','other') NOT NULL,
  `person_life_cycle_status` boolean DEFAULT TRUE
);

CREATE TABLE `Parent` (
  `parent_person_id` integer PRIMARY KEY,
  `parent_address_id` integer,
  `parent_job` nvarchar(50),
  `parent_type` enum('father','mother','grandpa','grandma','other') NOT NULL
);

CREATE TABLE `Driver` (
  `driver_person_id` integer PRIMARY KEY,
  `driver_experience` float DEFAULT 0,
  `driver_experience_type` enum('day','month','year') DEFAULT 'year',
  `driver_late_arrival_count` integer DEFAULT 0
);

CREATE TABLE `Student` (
  `student_id` integer PRIMARY KEY AUTO_INCREMENT,
  `student_parent_id` integer NOT NULL,
  `student_person_id` integer UNIQUE NOT NULL,
  `student_grade` integer
);

CREATE TABLE `Time_Role` (
  `time_role_id` integer PRIMARY KEY AUTO_INCREMENT,
  `time_role_start_pickup_time` time,
  `time_role_start_drop_off_time` time,
  `time_role_status` boolean DEFAULT TRUE
);

CREATE TABLE `Schedule` (
  `schedule_id` integer PRIMARY KEY AUTO_INCREMENT,
  `schedule_by_manager_id` integer NOT NULL,
  `schedule_driver_id` integer NOT NULL,
  `schedule_start_date` datetime,
  `schedule_end_date` datetime,
  `schedule_status` boolean DEFAULT TRUE
);

CREATE TABLE `Pickup_Schedule` (
  `pickup_schedule_id` integer PRIMARY KEY AUTO_INCREMENT,
  `pickup_schedule_detail_id` integer NOT NULL,
  `pickup_schedule_student_id` integer NOT NULL
);

CREATE TABLE `Detail_Schedule` (
  `detail_schedule_id` integer PRIMARY KEY AUTO_INCREMENT,
  `schedule_id` integer NOT NULL,
  `detail_schedule_bus_route_id` integer NOT NULL,
  `detail_schedule_time_role_id` integer NOT NULL
);

CREATE TABLE `Bus` (
  `bus_id` integer PRIMARY KEY AUTO_INCREMENT,
  `bus_license_plate` varchar(20) UNIQUE NOT NULL,
  `bus_brand` varchar(50),
  `bus_model` varchar(50),
  `bus_capacity` integer NOT NULL,
  `bus_year_manufactured` integer,
  `bus_has_wifi` boolean DEFAULT FALSE,
  `bus_has_camera` boolean DEFAULT FALSE,
  `bus_color` varchar(30),
  `bus_status` boolean DEFAULT TRUE
);

CREATE TABLE `Bus_Route` (
  `bus_route_id` integer PRIMARY KEY AUTO_INCREMENT,
  `route_id` integer NOT NULL,
  `bus_id` integer NOT NULL,
  `bus_route_status` boolean DEFAULT TRUE
);

CREATE TABLE `Report` (
  `report_id` integer PRIMARY KEY AUTO_INCREMENT,
  `report_driver_id` integer NOT NULL,
  `report_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `report_type` enum('start_pickup','picked_up','late','dropped_off','warning') NOT NULL,
  `report_content` nvarchar(255)
);

-- Foreign Key Constraints
ALTER TABLE `Account_Role` ADD CONSTRAINT `fk_account_role_account` FOREIGN KEY (`account_id`) REFERENCES `Account` (`account_id`) ON DELETE CASCADE;

ALTER TABLE `Account_Role` ADD CONSTRAINT `fk_account_role_role` FOREIGN KEY (`role_id`) REFERENCES `Role` (`role_id`) ON DELETE CASCADE;

ALTER TABLE `Location_District` ADD CONSTRAINT `fk_district_city` FOREIGN KEY (`location_city_id`) REFERENCES `Location_City` (`location_city_id`);

ALTER TABLE `Location_Ward` ADD CONSTRAINT `fk_ward_district` FOREIGN KEY (`location_district_id`) REFERENCES `Location_District` (`location_district_id`);

ALTER TABLE `Address` ADD CONSTRAINT `fk_address_city` FOREIGN KEY (`address_city_id`) REFERENCES `Location_City` (`location_city_id`);

ALTER TABLE `Address` ADD CONSTRAINT `fk_address_district` FOREIGN KEY (`address_district_id`) REFERENCES `Location_District` (`location_district_id`);

ALTER TABLE `Address` ADD CONSTRAINT `fk_address_ward` FOREIGN KEY (`address_ward_id`) REFERENCES `Location_Ward` (`location_ward_id`);

ALTER TABLE `Person` ADD CONSTRAINT `fk_person_account` FOREIGN KEY (`person_account_id`) REFERENCES `Account` (`account_id`);

-- Đảm bảo Parent chỉ reference Person có type = 'parent'
ALTER TABLE `Parent` ADD CONSTRAINT `fk_parent_person` FOREIGN KEY (`parent_person_id`) REFERENCES `Person` (`person_id`);

ALTER TABLE `Parent` ADD CONSTRAINT `fk_parent_address` FOREIGN KEY (`parent_address_id`) REFERENCES `Address` (`address_id`);

-- Đảm bảo Driver chỉ reference Person có type = 'driver'  
ALTER TABLE `Driver` ADD CONSTRAINT `fk_driver_person` FOREIGN KEY (`driver_person_id`) REFERENCES `Person` (`person_id`);

-- Đảm bảo Student chỉ reference Person có type = 'student'
ALTER TABLE `Student` ADD CONSTRAINT `fk_student_person` FOREIGN KEY (`student_person_id`) REFERENCES `Person` (`person_id`);

ALTER TABLE `Student` ADD CONSTRAINT `fk_student_parent` FOREIGN KEY (`student_parent_id`) REFERENCES `Parent` (`parent_person_id`);

ALTER TABLE `Detail_Route` ADD CONSTRAINT `fk_detail_route_route` FOREIGN KEY (`route_id`) REFERENCES `Route` (`route_id`);

ALTER TABLE `Detail_Route` ADD CONSTRAINT `fk_detail_route_start` FOREIGN KEY (`detail_route_start_point_id`) REFERENCES `Address` (`address_id`);

ALTER TABLE `Detail_Route` ADD CONSTRAINT `fk_detail_route_end` FOREIGN KEY (`detail_route_end_point_id`) REFERENCES `Address` (`address_id`);

-- Đảm bảo Schedule manager chỉ reference Person có type = 'manager' hoặc 'other'
ALTER TABLE `Schedule` ADD CONSTRAINT `fk_schedule_manager` FOREIGN KEY (`schedule_by_manager_id`) REFERENCES `Person` (`person_id`);

-- Đảm bảo Schedule driver chỉ reference Driver (đã được link tới Person có type = 'driver')
ALTER TABLE `Schedule` ADD CONSTRAINT `fk_schedule_driver` FOREIGN KEY (`schedule_driver_id`) REFERENCES `Driver` (`driver_person_id`);

ALTER TABLE `Detail_Schedule` ADD CONSTRAINT `fk_detail_schedule_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `Schedule` (`schedule_id`);

ALTER TABLE `Detail_Schedule` ADD CONSTRAINT `fk_detail_schedule_time_role` FOREIGN KEY (`detail_schedule_time_role_id`) REFERENCES `Time_Role` (`time_role_id`);

ALTER TABLE `Detail_Schedule` ADD CONSTRAINT `fk_detail_schedule_bus_route` FOREIGN KEY (`detail_schedule_bus_route_id`) REFERENCES `Bus_Route` (`bus_route_id`);

ALTER TABLE `Bus_Route` ADD CONSTRAINT `fk_bus_route_route` FOREIGN KEY (`route_id`) REFERENCES `Route` (`route_id`);

ALTER TABLE `Bus_Route` ADD CONSTRAINT `fk_bus_route_bus` FOREIGN KEY (`bus_id`) REFERENCES `Bus` (`bus_id`);

ALTER TABLE `Report` ADD CONSTRAINT `fk_report_driver` FOREIGN KEY (`report_driver_id`) REFERENCES `Driver` (`driver_person_id`);

ALTER TABLE `Pickup_Schedule` ADD CONSTRAINT `fk_pickup_detail_schedule` FOREIGN KEY (`pickup_schedule_detail_id`) REFERENCES `Detail_Schedule` (`detail_schedule_id`);

ALTER TABLE `Pickup_Schedule` ADD CONSTRAINT `fk_pickup_student` FOREIGN KEY (`pickup_schedule_student_id`) REFERENCES `Student` (`student_id`);

-- Thêm CHECK constraints để đảm bảo tính nhất quán enum
ALTER TABLE `Parent` ADD CONSTRAINT `chk_parent_person_type` 
CHECK ((SELECT person_type FROM Person WHERE person_id = parent_person_id) = 'parent');

ALTER TABLE `Driver` ADD CONSTRAINT `chk_driver_person_type` 
CHECK ((SELECT person_type FROM Person WHERE person_id = driver_person_id) = 'driver');

ALTER TABLE `Student` ADD CONSTRAINT `chk_student_person_type` 
CHECK ((SELECT person_type FROM Person WHERE person_id = student_person_id) = 'student');

ALTER TABLE `Schedule` ADD CONSTRAINT `chk_manager_person_type` 
CHECK ((SELECT person_type FROM Person WHERE person_id = schedule_by_manager_id) IN ('manager', 'other'));