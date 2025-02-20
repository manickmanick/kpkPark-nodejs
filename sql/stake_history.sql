CREATE TABLE stake_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    currency_id INT NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    staking_plan_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
