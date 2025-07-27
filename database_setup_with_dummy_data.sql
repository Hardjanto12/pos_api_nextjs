-- Create Database
CREATE DATABASE IF NOT EXISTS poshit;
USE poshit;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- e.g., 'admin', 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    sku VARCHAR(255) UNIQUE,
    user_id INT, -- User who added/manages this product
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: transactions
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_amount DECIMAL(10, 2) NOT NULL,
    total_items INT NOT NULL,
    transaction_date DATETIME NOT NULL,
    user_id INT, -- User who processed the transaction
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: transaction_items
CREATE TABLE IF NOT EXISTS transaction_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Price at the time of transaction
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Table: settings
CREATE TABLE IF NOT EXISTS settings (
    user_id INT NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, `key`),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Dummy Data

-- Users
INSERT INTO users (username, password, role) VALUES
('admin', 'adminpass', 'admin'),
('john_doe', 'johnpass', 'user'),
('jane_smith', 'janepass', 'user');

-- Products (associated with admin user)
INSERT INTO products (name, description, price, stock_quantity, sku, user_id) VALUES
('Laptop', 'High performance laptop', 1200.00, 50, 'LAPTOP001', 1),
('Mouse', 'Wireless optical mouse', 25.00, 200, 'MOUSE001', 1),
('Keyboard', 'Mechanical gaming keyboard', 75.00, 100, 'KEYBOARD001', 1),
('Monitor', '27-inch 4K monitor', 350.00, 30, 'MONITOR001', 1),
('Webcam', 'Full HD webcam', 40.00, 80, 'WEBCAM001', 1);

-- Transactions (associated with john_doe user)
INSERT INTO transactions (total_amount, total_items, transaction_date, user_id) VALUES
(1225.00, 2, '2025-07-19 10:00:00', 2), -- Laptop + Mouse
(75.00, 1, '2025-07-19 11:30:00', 2),  -- Keyboard
(390.00, 2, '2025-07-19 14:00:00', 2); -- Monitor + Webcam

-- Transaction Items
INSERT INTO transaction_items (transaction_id, product_id, quantity, price, subtotal) VALUES
(1, 1, 1, 1200.00, 1200.00), -- Laptop
(1, 2, 1, 25.00, 25.00),    -- Mouse
(2, 3, 1, 75.00, 75.00),    -- Keyboard
(3, 4, 1, 350.00, 350.00),   -- Monitor
(3, 5, 1, 40.00, 40.00);    -- Webcam

-- Settings (associated with admin user)
INSERT INTO settings (user_id, `key`, value) VALUES
(1, 'printer_type', 'Bluetooth'),
(1, 'business_name', 'My Tech Store'),
(1, 'receipt_footer', 'Thank you for shopping with us!'),
(1, 'use_inventory_tracking', 'true'),
(1, 'use_sku_field', 'true');
