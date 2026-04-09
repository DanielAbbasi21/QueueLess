USE queueless;

-- Test users
INSERT INTO users (name, email, password) VALUES
('Alice', 'alice@test.com', '123456'),
('Bob', 'bob@test.com', '123456');

-- Businesses
INSERT INTO businesses (name) VALUES
('Bank'),
('Hospital');

-- Tickets
INSERT INTO tickets (user_id, business_id, message) VALUES
(1, 1, 'I need help with my account'),
(2, 2, 'I need help with booking');
