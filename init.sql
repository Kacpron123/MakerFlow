-- enums
CREATE TYPE role AS ENUM ('USER', 'ADMIN');
-- tables
CREATE TABLE users (
   user_id SERIAL PRIMARY KEY,
   username TEXT NOT NULL UNIQUE,
   password_hash TEXT NOT NULL,
   created_at TIMESTAMP DEFAULT NOW()
   );
CREATE TABLE groups (
   group_id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
   name TEXT NOT NULL,
   stock_number INT DEFAULT 0,
   parent_group_id INT REFERENCES groups(group_id) ON DELETE SET NULL,
   description TEXT
   );
CREATE TABLE products (
   product_id SERIAL PRIMARY KEY,
   name TEXT NOT NULL,
   base_price NUMERIC(10,2),
   group_id INT REFERENCES groups(group_id) ON DELETE SET NULL,
   user_id INT REFERENCES users(user_id) ON DELETE CASCADE
   );
CREATE TABLE transactions (
   transaction_id SERIAL PRIMARY KEY,
   user_id INTEGER REFERENCES users(user_id),
   total_price DECIMAL(10, 2) NOT NULL,

   created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sale_items (
   sale_id SERIAL PRIMARY KEY,
   transaction_id INTEGER REFERENCES transactions(transaction_id) ON DELETE CASCADE,
   product_id INTEGER REFERENCES products(product_id),
   quantity INTEGER NOT NULL,
   price_at_sale DECIMAL(10, 2) NOT NULL
);
CREATE TABLE tokens (
	token_id SERIAL primary key,
	user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
   token TEXT NOT NULL UNIQUE,
   expires_at TIMESTAMP NOT NULL
   );

CREATE TABLE roles(
   user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
   role_type role
   );
