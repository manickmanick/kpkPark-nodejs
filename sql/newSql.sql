-- Table: staking_plan
CREATE TABLE staking_plan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    duration_days INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: level_bonus_plan
CREATE TABLE level_bonus_plan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level INT NOT NULL UNIQUE,
    bonus_percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default staking plans
INSERT INTO staking_plan (name, min_amount, max_amount, duration_days) VALUES
('Silver Plan', 50.00, 500.00, 30),
('Gold Plan', 500.00, 5000.00, 60);

-- Insert default level bonus percentages
INSERT INTO level_bonus_plan (level, bonus_percentage) VALUES
(1, 5.00),  -- 5% for level 1
(2, 3.00),  -- 3% for level 2
(3, 2.00),  -- 2% for level 3
(4, 1.50),  -- 1.5% for level 4
(5, 1.00);  -- 1% for level 5
