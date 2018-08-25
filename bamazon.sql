ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'process.env.DB_PASS';

DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NULL,
    department_name VARCHAR(45) NULL,
    price FLOAT NULL, 
    stock_quantity INTEGER NULL, 
    product_sales FLOAT NULL DEFAULT 0,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments(
    department_id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(45) NULL,
    over_head_costs INTEGER NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
    ('Addidas Ultra Boosts', 'Clothing', 180.99, 20),
    ('Timberlands', 'Clothing', 240.99, 10),
    ('Nike Free Runs 5.0', 'Clothing', 80.99, 50),
    ('Vans Originals', 'Clothing', 60.99, 100),
    ('Addidas EQT', 'Clothing', 80.99, 5),
    ('NVIDIA GTX 1080', 'Electronics', 380.99, 2),
    ('NVIDIA GTX 1060', 'Electronics', 190.99, 4),
    ('INTEL I7 6600k CPU', 'Electronics', 360.99, 7),
    ('iPod Video', 'Electronics', 40.99, 1),
    ('iPod Nano', 'Electronics', 30.99, 0);
    
SELECT * FROM products; 