-- Insert additional accounts for SSB System - Batch 1 (50 accounts)
-- Database: SSB
-- 30 Driver accounts (driver6 - driver35)
-- 20 Parent accounts (parent11 - parent30)
-- Password: $2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa
-- Note: Some accounts have login_status = 0 (inactive)

USE `SSB`;

INSERT INTO `Account` (`account_email`, `account_password`, `account_login_status`) VALUES
-- Driver accounts (driver6 - driver35) - 30 accounts
('driver6@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver7@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver8@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver9@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 0),
('driver10@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver11@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver12@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver13@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 0),
('driver14@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver15@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver16@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver17@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 0),
('driver18@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver19@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver20@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver21@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 0),
('driver22@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver23@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver24@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver25@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 0),
('driver26@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver27@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver28@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver29@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 0),
('driver30@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver31@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver32@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver33@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 0),
('driver34@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('driver35@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),

-- Parent accounts (parent11 - parent30) - 20 accounts
('parent11@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent12@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 0),
('parent13@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent14@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent15@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent16@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 0),
('parent17@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent18@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent19@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent20@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 0),
('parent21@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent22@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent23@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent24@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 0),
('parent25@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent26@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent27@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent28@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 0),
('parent29@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1),
('parent30@gmail.com', '$2b$04$SCeRVQ6bDNuFezgbCbp8uOp7h3VjlNtJT3lRqVcbuozF38DQyoyNa', 1);

-- Summary: Batch 1
-- Total: 50 accounts
-- Drivers: 30 (driver6 - driver35)
-- Parents: 20 (parent11 - parent30)
-- Inactive accounts (login_status = 0): 9 accounts
