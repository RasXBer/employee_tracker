-- Insert sample departments
INSERT INTO departments (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Human Resources'),
  ('Engineering');

-- Insert sample roles
INSERT INTO roles (title, salary, department_id) VALUES
  ('Sales Representative', 50000.00, 1),
  ('Sales Manager', 80000.00, 1),
  ('Marketing Coordinator', 55000.00, 2),
  ('HR Specialist', 65000.00, 3),
  ('Software Engineer', 75000.00, 4),
  ('Senior Software Engineer', 95000.00, 4);

-- Insert sample employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Wick', 1, 2),
  ('Sarah', 'Smith', 1, 2),
  ('Michael', 'Johnson', 2, NULL),
  ('Emily', 'Moore', 3, 4),
  ('David', 'Brown', 4, NULL),
  ('Lilly', 'Jones', 5, 6);

