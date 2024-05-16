const inquirer = require('inquirer');
const { Pool } = require('pg');

// Create a pool for connecting to the PostgreSQL database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cms_db',
  password: '1234',
  port: 5432,
});

// Function to start the application
async function startApp() {
  console.log('Welcome to the Employee Management System!');

  // Call the function to handle user input
  await handleUserInput();
}

// Function to view all departments
async function viewDepartments() {
  try {
    // Query to retrieve all departments
    const query = 'SELECT * FROM departments order by id';

    const result = await pool.query(query);

    // Display the departments in a formatted table
    console.log('\n');
    console.table(result.rows);
  } catch (error) {
    console.error('Error viewing departments:', error);
  }
}

// Function to view all roles
async function viewRoles() {
  try {
    // Query to retrieve all roles
    const query = 'SELECT * FROM roles order by id'  ;

    const result = await pool.query(query);

    // Display roles in a formatted table
    console.log('\n');
    console.table(result.rows);
  } catch (error) {
    console.error('Error viewing roles:', error);
  }
}

// Function to view all employees
async function viewEmployees() {
  try {
    // Query to retrieve all employees
    // const query = 'SELECT * FROM employees';

    const query = `
    SELECT 
          e.id,
          e.first_name,
          e.last_name,
          r.title,
          d.name AS department,
          r.salary,
          CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM 
          employees e
        INNER JOIN 
          roles r ON e.role_id = r.id
        INNER JOIN 
          departments d ON r.department_id = d.id
        LEFT JOIN 
          employees m ON e.manager_id = m.id
        order by e.id`;

    const result = await pool.query(query);

    // Display all employees in a formatted table
    console.log('\n');
    console.table(result.rows);
  } catch (error) {
    console.error('Error viewing employees:', error);
  }
}

// Function to add a department
async function addDepartment() {
  try {
    // Prompt the user to enter the name of the new department
    const { departmentName } = await inquirer.prompt({
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the new department:',
    });

    // Insert the new department into the database
    const query = 'INSERT INTO departments (name) VALUES ($1)';
    const values = [departmentName];

    await pool.query(query, values);

    console.log(`The department "${departmentName}" has been added successfully.`);
  } catch (error) {
    console.error('Error adding department:', error);
  }
}

// Function to add a role
async function addRole() {
  try {
    // Prompt the user to enter the details of the new role
    const { title, salary, department_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the new role:',
      },
      {
        type: 'number',
        name: 'salary',
        message: 'Enter the salary for the new role:',
      },
      {
        type: 'number',
        name: 'department_id',
        message: 'Enter the department ID for the new role:',
      },
    ]);

    // Insert the new role into the database
    const query = 'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)';
    const values = [title, salary, department_id];

    await pool.query(query, values);

    console.log(`The role "${title}" has been added successfully.`);
  } catch (error) {
    console.error('Error adding role:', error);
  }
}

// Function to add an employee
async function addEmployee() {
  try {
    // Prompt the user to enter the details of the new employee
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the new employee:',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the new employee:',
      },
      {
        type: 'number',
        name: 'role_id',
        message: 'Enter the role ID for the new employee:',
      },
      {
        type: 'number',
        name: 'manager_id',
        message: 'Enter the manager ID for the new employee (optional, leave blank if none):',
      },
    ]);

    // Insert the new employee into the database
    const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
    const values = [first_name, last_name, role_id, manager_id || null]; // Use null if manager_id is not provided

    await pool.query(query, values);

    console.log(`The employee "${first_name} ${last_name}" has been added successfully.`);
  } catch (error) {
    console.error('Error adding employee:', error);
  }
}

// Function to update an employee's role
async function updateEmployeeRole() {
  try {
    // Prompt the user to select an employee to update
    const employees = await pool.query('SELECT * FROM employees');
    const employeeChoices = employees.rows.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    const { employeeId } = await inquirer.prompt({
      type: 'list',
      name: 'employeeId',
      message: 'Select an employee to update:',
      choices: employeeChoices,
    });

    // Prompt the user to select a new role for the employee
    const roles = await pool.query('SELECT * FROM roles');
    const roleChoices = roles.rows.map(role => ({
      name: role.title,
      value: role.id,
    }));

    const { roleId } = await inquirer.prompt({
      type: 'list',
      name: 'roleId',
      message: 'Select a new role for the employee:',
      choices: roleChoices,
    });

    // Update the employee's role in the database
    await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [roleId, employeeId]);

    console.log('Employee role updated successfully.');
  } catch (error) {
    console.error('Error updating employee role:', error);
  }
}

// Function to handle user input
async function handleUserInput() {
  // Prompt the user with the main menu options
  const { choice } = await inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit',
    ],
  });

  // Call the appropriate function based on the user's choice
  switch (choice) {
    case 'View all departments':
      await viewDepartments();
      break;
    case 'View all roles':
      await viewRoles();
      break;
    case 'View all employees':
      await viewEmployees();
      break;
    case 'Add a department':
      await addDepartment();
      break;
    case 'Add a role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRole();
      break;
    case 'Exit':
      console.log('Exiting application...');
      pool.end(); // Close the database connection
      return; // Exit the function and stop the application
    default:
      console.log('Invalid choice. Please try again.');
      break;
  }

  // After completing the chosen action, prompt the user again
  await handleUserInput();
}

// Start the application
startApp();

