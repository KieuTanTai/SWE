-- Insert data for Time_Role table
-- Database: SSB_System
-- Purpose: Set fixed time schedules for morning (6 AM) and noon (12 PM)

USE `SSB_System`;

INSERT INTO `Time_Role` (`time_role_start_pickup_time`, `time_role_start_drop_off_time`, `time_role_status`) VALUES
-- Morning shift: Start pickup at 6:00 AM, Start drop-off at 6:00 AM
('06:00:00', '06:00:00', 1),

-- Noon shift: Start pickup at 12:00 PM, Start drop-off at 12:00 PM
('12:00:00', '12:00:00', 1);

-- Verify inserted data
SELECT * FROM `Time_Role`;
