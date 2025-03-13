const inquirer = require('inquirer');
const db = require('./db');

function mainMenu() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Exit'
      ]
    }
  ])
  .then(answer => {
    switch (answer.action) {
      case 'View All Departments':
        db.viewDepartments(mainMenu); 
        break;
      case 'View All Roles':
        db.viewRoles(mainMenu); 
        break;
      case 'View All Employees':
        db.viewEmployees(mainMenu); 
        break;
      case 'Add a Department':
        inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
          }
        ])
        .then(answer => {
          db.addDepartment(answer.name, mainMenu); 
        });
        break;
      case 'Add a Role':
        inquirer.prompt([
          {
            type: 'input',
            name: 'title',
            message: 'Enter the role title:'
          },
          {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:'
          },
          {
            type: 'input',
            name: 'departmentId',
            message: 'Enter the department ID for the role:'
          }
        ])
        .then(answer => {
          db.addRole(answer.title, answer.salary, answer.departmentId, mainMenu); 
        });
        break;
      case 'Add an Employee':
        inquirer.prompt([
          {
            type: 'input',
            name: 'firstName',
            message: 'Enter the employee’s first name:'
          },
          {
            type: 'input',
            name: 'lastName',
            message: 'Enter the employee’s last name:'
          },
          {
            type: 'input',
            name: 'roleId',
            message: 'Enter the employee’s role ID:'
          },
          {
            type: 'input',
            name: 'managerId',
            message: 'Enter the employee’s manager ID (or leave blank if none):'
          }
        ])
        .then(answer => {
          db.addEmployee(answer.firstName, answer.lastName, answer.roleId, answer.managerId, mainMenu);
        });
        break;
      case 'Update an Employee Role':
        inquirer.prompt([
          {
            type: 'input',
            name: 'employeeId',
            message: 'Enter the ID of the employee to update:'
          },
          {
            type: 'input',
            name: 'newRoleId',
            message: 'Enter the new role ID for the employee:'
          }
        ])
        .then(answer => {
          db.updateEmployeeRole(answer.employeeId, answer.newRoleId, mainMenu); 
        });
        break;
      default:
        process.exit();
    }
  });
}

mainMenu(); 
