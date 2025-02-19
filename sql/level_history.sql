CREATE TABLE level_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_user_id INT NOT NULL, -- Who staked
    to_user_id INT NOT NULL,   -- Who received the bonus
    level INT NOT NULL,        -- Which level (1 to 5)
    currency_id INT NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
);
