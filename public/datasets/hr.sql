CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  salary INTEGER NOT NULL
);

INSERT INTO departments (id, name) VALUES
  (1, 'Engineering'),
  (2, 'Marketing'),
  (3, 'Sales'),
  (4, 'HR');

INSERT INTO employees (id, name, department_id, salary) VALUES
  (1, 'Alice', 1, 75000),
  (2, 'Bob', 2, 45000),
  (3, 'Charlie', 1, 60000),
  (4, 'Diana', 3, 52000),
  (5, 'Eve', 2, 48000),
  (6, 'Frank', 4, 55000),
  (7, 'Grace', 1, 80000),
  (8, 'Hank', 3, 47000);
