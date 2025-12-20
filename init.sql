-- enums
CREATE TYPE role AS ENUM ('USER', 'ADMIN');
-- tables
CREATE TABLE users (
   user_id SERIAL PRIMARY KEY,
   username TEXT NOT NULL UNIQUE,
   password_hash TEXT NOT NULL
   );
CREATE TABLE groups (
   group_id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
   name TEXT NOT NULL,
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
CREATE TABLE other_transaction (
   transaction_id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
   type TEXT NOT NULL,
   description TEXT,
   amount NUMERIC(10,2) NOT NULL,
   transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
CREATE TABLE payments (
   payment_id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
   -- commission_id INT, -- for commision table commissions
   payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   amount NUMERIC(10,2) NOT NULL
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

-- methods:
CREATE OR REPLACE FUNCTION get_payments(
   user_id int,
   from_date timestamp,
   to_date timestamp
   ) RETURNS TABLE (
      payment_id int,
      payment_date timestamp,
      amount numeric(10,2)
   ) AS '
   SELECT payment_id, payment_date, amount
   FROM payments p
   WHERE p.user_id = $1
   AND p.payment_date >= $2
   AND p.payment_date <= $3
   ' LANGUAGE sql;