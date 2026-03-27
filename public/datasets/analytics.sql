CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  signup_date DATE NOT NULL,
  plan TEXT DEFAULT 'free'
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  started_at TIMESTAMP NOT NULL,
  duration_seconds INTEGER NOT NULL,
  device TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY,
  session_id INTEGER REFERENCES sessions(id),
  event_type TEXT NOT NULL,
  event_data TEXT,
  created_at TIMESTAMP NOT NULL
);

INSERT INTO users (id, username, signup_date, plan) VALUES
  (1, 'alice_dev', '2023-01-15', 'pro'),
  (2, 'bob_code', '2023-03-20', 'free'),
  (3, 'charlie_ml', '2023-06-01', 'pro'),
  (4, 'diana_data', '2024-01-10', 'free'),
  (5, 'eve_full', '2024-02-28', 'pro');

INSERT INTO sessions (id, user_id, started_at, duration_seconds, device) VALUES
  (1, 1, '2024-01-10 09:00:00', 3600, 'desktop'),
  (2, 1, '2024-01-11 14:00:00', 1800, 'mobile'),
  (3, 2, '2024-01-10 10:00:00', 900, 'desktop'),
  (4, 3, '2024-01-12 08:00:00', 5400, 'desktop'),
  (5, 4, '2024-01-10 16:00:00', 600, 'mobile'),
  (6, 5, '2024-01-13 11:00:00', 2700, 'desktop');

INSERT INTO events (id, session_id, event_type, event_data, created_at) VALUES
  (1, 1, 'page_view', 'dashboard', '2024-01-10 09:00:00'),
  (2, 1, 'click', 'start_practice', '2024-01-10 09:05:00'),
  (3, 1, 'code_submit', 'two_sum', '2024-01-10 09:30:00'),
  (4, 2, 'page_view', 'plan', '2024-01-11 14:00:00'),
  (5, 3, 'page_view', 'dashboard', '2024-01-10 10:00:00'),
  (6, 4, 'code_submit', 'binary_search', '2024-01-12 08:30:00'),
  (7, 4, 'code_submit', 'valid_palindrome', '2024-01-12 09:00:00'),
  (8, 5, 'page_view', 'landing', '2024-01-10 16:00:00'),
  (9, 6, 'code_submit', 'fizzbuzz', '2024-01-13 11:15:00');
