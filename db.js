const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

async function viewDepartments(mainMenu) {
  try {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
  } catch (err) {
    console.error('Error retrieving departments:', err);
  } finally {
    mainMenu();
  }
}

async function addDepartment(name, mainMenu) {
  try {
    const query = 'INSERT INTO department (name) VALUES ($1)';
    await client.query(query, [name]);
    console.log('Department added!');
  } catch (err) {
    console.error('Error adding department:', err);
  } finally {
    mainMenu();
  }
}

async function viewRoles(mainMenu) {
  try {
    const query = `
      SELECT r.id, r.title, r.salary, d.name AS department
      FROM role r
      JOIN department d ON r.department_id = d.id;
    `;
    const res = await client.query(query);
    console.table(res.rows);
  } catch (err) {
    console.error('Error retrieving roles:', err);
  } finally {
    mainMenu();
  }
}

async function addRole(title, salary, departmentId, mainMenu) {
  try {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
    await client.query(query, [title, salary, departmentId]);
    console.log('Role added!');
  } catch (err) {
    console.error('Error adding role:', err);
  } finally {
    mainMenu();
  }
}

async function viewEmployees(mainMenu) {
  try {
    const query = `
      SELECT e.id, e.first_name, e.last_name, r.title AS role, d.name AS department, r.salary, m.first_name AS manager
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    const res = await client.query(query);
    console.table(res.rows);
  } catch (err) {
    console.error('Error retrieving employees:', err);
  } finally {
    mainMenu();
  }
}

async function addEmployee(firstName, lastName, roleId, managerId, mainMenu) {
    try {
      if (managerId) {
        const checkManagerQuery = 'SELECT * FROM employee WHERE id = $1';
        const managerRes = await client.query(checkManagerQuery, [managerId]);
  
        if (managerRes.rows.length === 0) {
          console.log(`Manager with ID ${managerId} does not exist.`);
          return mainMenu(); 
        }
      }
  
      const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
      await client.query(query, [firstName, lastName, roleId, managerId || null]); 
      console.log('Employee added!');
    } catch (err) {
      console.error('Error adding employee:', err);
    } finally {
      mainMenu(); 
    }
  }

async function updateEmployeeRole(employeeId, newRoleId, mainMenu) {
  try {
    const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
    await client.query(query, [newRoleId, employeeId]);
    console.log('Employee role updated!');
  } catch (err) {
    console.error('Error updating employee role:', err);
  } finally {
    mainMenu();
  }
}

module.exports = {
  viewDepartments,
  addDepartment,
  viewRoles,
  addRole,
  viewEmployees,
  addEmployee,
  updateEmployeeRole,
};

