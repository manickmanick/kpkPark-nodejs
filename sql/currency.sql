CREATE TABLE currency (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50) UNIQUE NOT NULL
);


INSERT INTO currency (name, symbol) VALUES
('Bitcoin', 'BTC'),
('Ethereum', 'ETH'),
('Tether', 'USDT'),
('Binance Coin', 'BNB'),
('Solana', 'SOL'),
('Ripple', 'XRP'),
('Cardano', 'ADA'),
('Polkadot', 'DOT'),
('Litecoin', 'LTC'),
('Dogecoin', 'DOGE');
