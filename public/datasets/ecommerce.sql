CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  order_date DATE NOT NULL,
  total NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER REFERENCES orders(order_id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

INSERT INTO customers (id, name, email, city) VALUES
  (1, 'John Doe', 'john@example.com', 'New York'),
  (2, 'Jane Smith', 'jane@example.com', 'San Francisco'),
  (3, 'Bob Wilson', 'bob@example.com', 'Chicago');

INSERT INTO products (id, name, category, price) VALUES
  (1, 'Laptop', 'Electronics', 999.99),
  (2, 'Mouse', 'Electronics', 29.99),
  (3, 'Notebook', 'Office', 5.99),
  (4, 'Desk Chair', 'Furniture', 249.99),
  (5, 'Monitor', 'Electronics', 399.99);

INSERT INTO orders (order_id, customer_id, order_date, total) VALUES
  (1, 1, '2023-06-15', 1029.98),
  (2, 2, '2023-11-20', 249.99),
  (3, 1, '2024-03-10', 435.98),
  (4, 3, '2024-06-15', 29.99);

INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES
  (1, 1, 1, 1, 999.99),
  (2, 1, 2, 1, 29.99),
  (3, 2, 4, 1, 249.99),
  (4, 3, 5, 1, 399.99),
  (5, 3, 3, 6, 35.94),
  (6, 4, 2, 1, 29.99);
