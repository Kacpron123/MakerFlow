CREATE TABLE users (
   user_id SERIAL PRIMARY KEY,
   username TEXT NOT NULL,
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
   group_id INT REFERENCES groups(group_id) ON DELETE SET NULL
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
   amount NUMERIC(10,2) NOT NULL,
   method TEXT
);
CREATE TABLE tokens (
	token_id SERIAL primary key,
	user_id INT REFERENCES users(user_id),
   token TEXT NOT NULL,
   expires_at TIMESTAMP NOT NULL
);