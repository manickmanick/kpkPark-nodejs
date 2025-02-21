-- CREATE TABLE staking (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     user_id INT NOT NULL,
--     currency_id INT NOT NULL,
--     amount DECIMAL(20, 8) NOT NULL,
--     staking_plan_id INT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );
CREATE TABLE staking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    currency_id INT NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    reward DECIMAL(18,8) NOT NULL DEFAULT 0,
    reward_status ENUM('pending', 'released') DEFAULT 'pending',
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    staking_plan_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (staking_plan_id) REFERENCES staking_plan(id)
);
