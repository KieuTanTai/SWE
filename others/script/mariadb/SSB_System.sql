CREATE TABLE `Account` (
  `account_id` integer PRIMARY KEY,
  `account_email` varchar(255),
  `account_password` varchar(25),
  `account_create_date` timestamp,
  `account_last_updated_date` timestamp,
  `account_login_status` boolean
);

CREATE TABLE `Role` (
  `role_id` integer PRIMARY KEY,
  `role_name` varchar(25),
  `role_created_date` timestamp,
  `role_active_status` boolean
);

CREATE TABLE `Account_Role` (
  `role_id` integer,
  `account_id` integer,
  PRIMARY KEY (`role_id`, `account_id`)
);

CREATE TABLE `Location_City` (
  `location_city_id` integer PRIMARY KEY,
  `location_city_name` nvarchar(50),
  `location_city_status` boolean
);

CREATE TABLE `Location_District` (
  `location_district_id` integer PRIMARY KEY,
  `location_district_name` nvarchar(50),
  `location_district_status` boolean
);

CREATE TABLE `Location_Ward` (
  `location_ward_id` integer PRIMARY KEY,
  `location_ward_name` nvarchar(50),
  `location_ward_status` boolean
);

CREATE TABLE `Address` (
  `address_id` integer PRIMARY KEY,
  `address_city_id` integer,
  `address_district_id` integer,
  `address_ward_id` integer,
  `address_number` varchar(50)
);

CREATE TABLE `Route` (
  `route_id` integer PRIMARY KEY,
  `route_name` nvarchar(50),
  `route_status` boolean
);

CREATE TABLE `Detail_Route` (
  `detail_route_id` integer PRIMARY KEY,
  `route_id` integer,
  `detail_route_start_point_id` integer,
  `detail_route_end_point_id` integer,
  `detail_route_distance` float
);

CREATE TABLE `Person` (
  `person_id` integer PRIMARY KEY,
  `person_account_id` integer,
  `person_phone` integer,
  `person_name` nvarchar(50),
  `person_gender` boolean,
  `person_birthday` date,
  `person_type` enum(manager,driver,parent,student,other),
  `person_life_cycle_status` boolean
);

CREATE TABLE `Parent` (
  `parent_person_id` integer,
  `parent_address_id` integer,
  `parent_job` nvarchar(50),
  `parent_type` enum(father,mother,grandpa,grandma,other)
);

CREATE TABLE `Driver` (
  `driver_person_id` integer,
  `driver_experience` float,
  `driver_experience_type` enum(day,month,year),
  `driver_late_arrival_count` integer
);

CREATE TABLE `Student` (
  `student_id` integer PRIMARY KEY,
  `student_parent_id` integer,
  `student_person_id` integer,
  `student_grade` integer
);

CREATE TABLE `Time_Role` (
  `time_role_id` integer PRIMARY KEY,
  `time_role_start_pickup_time` time,
  `time_role_start_drop_off_time` time,
  `time_role_status` boolean
);

CREATE TABLE `Schedule` (
  `schedule_id` integer PRIMARY KEY,
  `schedule_by_manager_id` integer,
  `schedule_driver_id` integer,
  `schedule_start_date` datetime,
  `schedule_end_date` datetime,
  `schedule_status` boolean
);

CREATE TABLE `Pickup_Schedule` (
  `pickup_schedule_id` integer PRIMARY KEY,
  `pickup_schedule_detail_id` integer,
  `pickup_schedule_student_id` integer
);

CREATE TABLE `Detail_Schedule` (
  `detail_schedule_id` integer PRIMARY KEY,
  `schedule_id` integer,
  `detail_schedule_bus_route_id` integer,
  `detail_schedule_time_role_id` integer
);

CREATE TABLE `Bus` (
  `bus_id` integer PRIMARY KEY,
  `bus_license_plate` string,
  `bus_brand` string,
  `bus_model` string,
  `bus_capacity` integer,
  `bus_year_manufactured` integer,
  `bus_has_wifi` boolean,
  `bus_has_camera` boolean,
  `bus_color` string,
  `bus_status` boolean
);

CREATE TABLE `Bus_Route` (
  `bus_route_id` integer PRIMARY KEY,
  `route_id` integer,
  `bus_id` integer,
  `bus_route_status` boolean
);

CREATE TABLE `Report` (
  `report_id` integer PRIMARY KEY,
  `report_driver_id` integer,
  `report_time` datetime,
  `report_type` enum(start_pickup,picked_up,late,dropped_off,warning),
  `report_content` nvarchar(50)
);

ALTER TABLE `Location_City` ADD CONSTRAINT `address_city` FOREIGN KEY (`location_city_id`) REFERENCES `Address` (`address_city_id`);

ALTER TABLE `Location_District` ADD CONSTRAINT `address_district` FOREIGN KEY (`location_district_id`) REFERENCES `Address` (`address_district_id`);

ALTER TABLE `Location_Ward` ADD CONSTRAINT `address_ward` FOREIGN KEY (`location_ward_id`) REFERENCES `Address` (`address_ward_id`);

ALTER TABLE `Account_Role` ADD CONSTRAINT `account_role_link` FOREIGN KEY (`account_id`) REFERENCES `Account` (`account_id`);

ALTER TABLE `Account_Role` ADD CONSTRAINT `account_route` FOREIGN KEY (`role_id`) REFERENCES `Role` (`role_id`);

ALTER TABLE `Account` ADD CONSTRAINT `person_account` FOREIGN KEY (`account_id`) REFERENCES `Person` (`person_account_id`);

ALTER TABLE `Parent` ADD CONSTRAINT `person_parent` FOREIGN KEY (`parent_person_id`) REFERENCES `Person` (`person_id`);

ALTER TABLE `Driver` ADD CONSTRAINT `person_driver` FOREIGN KEY (`driver_person_id`) REFERENCES `Person` (`person_id`);

ALTER TABLE `Student` ADD CONSTRAINT `person_student` FOREIGN KEY (`student_person_id`) REFERENCES `Person` (`person_id`);

ALTER TABLE `Student` ADD CONSTRAINT `parent_student` FOREIGN KEY (`student_parent_id`) REFERENCES `Parent` (`parent_person_id`);

ALTER TABLE `Address` ADD CONSTRAINT `detail_route_start_point` FOREIGN KEY (`address_id`) REFERENCES `Detail_Route` (`detail_route_start_point_id`);

ALTER TABLE `Address` ADD CONSTRAINT `detail_route_end_point` FOREIGN KEY (`address_id`) REFERENCES `Detail_Route` (`detail_route_end_point_id`);

ALTER TABLE `Route` ADD CONSTRAINT `route_detail_route` FOREIGN KEY (`route_id`) REFERENCES `Detail_Route` (`route_id`);

ALTER TABLE `Person` ADD CONSTRAINT `schedule_manager` FOREIGN KEY (`person_id`) REFERENCES `Schedule` (`schedule_by_manager_id`);

ALTER TABLE `Driver` ADD CONSTRAINT `schedule_driver` FOREIGN KEY (`driver_person_id`) REFERENCES `Schedule` (`schedule_driver_id`);

ALTER TABLE `Detail_Schedule` ADD CONSTRAINT `schedule_detail` FOREIGN KEY (`schedule_id`) REFERENCES `Schedule` (`schedule_id`);

ALTER TABLE `Address` ADD CONSTRAINT `parent_selected_address` FOREIGN KEY (`address_id`) REFERENCES `Parent` (`parent_address_id`);

ALTER TABLE `Time_Role` ADD CONSTRAINT `detail_schedule_time_role` FOREIGN KEY (`time_role_id`) REFERENCES `Detail_Schedule` (`detail_schedule_time_role_id`);

ALTER TABLE `Bus_Route` ADD CONSTRAINT `detail_schedule_route` FOREIGN KEY (`bus_route_id`) REFERENCES `Detail_Schedule` (`detail_schedule_bus_route_id`);

ALTER TABLE `Bus` ADD CONSTRAINT `bus_route` FOREIGN KEY (`bus_id`) REFERENCES `Bus_Route` (`bus_id`);

ALTER TABLE `Route` ADD CONSTRAINT `route_for_bus` FOREIGN KEY (`route_id`) REFERENCES `Bus_Route` (`route_id`);

ALTER TABLE `Report` ADD CONSTRAINT `driver_report` FOREIGN KEY (`report_driver_id`) REFERENCES `Driver` (`driver_person_id`);

ALTER TABLE `Pickup_Schedule` ADD CONSTRAINT `pickup_detail` FOREIGN KEY (`pickup_schedule_detail_id`) REFERENCES `Detail_Schedule` (`detail_schedule_id`);

ALTER TABLE `Student` ADD CONSTRAINT `pickup_student` FOREIGN KEY (`student_id`) REFERENCES `Pickup_Schedule` (`pickup_schedule_student_id`);
