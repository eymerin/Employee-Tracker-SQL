const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employeedb',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId} \n`);
    startApp();
});

startApp = () => {
    inquirer.prompt([
        {
            name: 'initialInquiry',
            type: 'list',
            message: "Welcome to the employee management system. What would you like to do?",
            choices: [
                "View all departments", 
                "View all roles", 
                "View all employees", 
                "Add a department", 
                "Add a role", 
                "Add an employee", 
                "Update employee's role", 
                "Update employee's manager", 
                "Remove a department", 
                "Remove a role", 
                "Remove an employee", 
                "Exit program"]
        }
    ]).then((response) => {
        switch (response.initialInquiry) {

            case "View all departments":
                viewAllDepartments();    
                break;

            case "View all roles":
                viewAllRoles();
                break;

            case "View all employees":
                viewAllEmployees();
                break;

            case "Add a department":
                addDepartment();
            break;

            case "Add a role":
                addRole();
            break;

            case "Add an employee":
                addEmployee();
            break;

            case "Update employee's role":
                updateEmployeeRole();
            break;

            case "Exit program":
                connection.end();
                console.log("\n Session ended. \n");
                return;

            default:
                break;
        }
    })
}

viewAllDepartments = () => {
    connection.query(`SELECT department.name FROM department ORDER BY department.id ASC;`, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    })
};

viewAllRoles = () => {
    connection.query(`SELECT role.id, role.title, role.salary, department.name, department.id FROM role JOIN department ON role.department_id = department.id ORDER BY role.id ASC;`, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    })
};

viewAllEmployees = () => {
    connection.query(`SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, manager.first_name AS 'manager_firstname', manager.last_name AS 'manager_lastname' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;`, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    })
};

function addDepartment() {
    inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the department you'd like to add?",
      },
    ]).then(function (answer) {
      connection.query("INSERT INTO department SET ?", [answer], function (err) {
        if (err) throw err;
        console.log("Success");
        startApp();
      });
    });
}

function addRole() {
    connection.query("select id, name from department", (err, department) => {
      inquirer.prompt([
        {
          name: "title",
          type: "input",
          message: "What is the name of the role you'd like to add?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for this role?",
        },
        {
          name: "department_id",
          type: "list",
          choices: department.map((x) => ({ name: x.name, value: x.id })),
          message: "What is the department id for this role?",
        },
      ]).then(function (answer) {
        connection.query("INSERT INTO role SET ?", [answer], function (err) {
          if (err) throw err;
          console.log("Success");
          startApp();
        });
      });
    });
}

function addEmployee() {
    connection.query("select id, title from role", (err, role) => {
      connection.query("select id, last_name from employee", (err, manager) => {
        inquirer.prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is the first name of the employee you'd like to add?",
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the last name of the employee you'd like to add?",
          },
          {
            name: "role_id",
            type: "list",
            choices: role.map((x) => ({ name: x.title, value: x.id })),
            message: "What is the role id for this employee?",
          },
          {
            name: "manager_id",
            type: "list",
            choices: manager.map((x) => ({ name: x.last_name, value: x.id })),
            message: "What is the manager id for this employee?",
          },
        ]).then(function (answer) {
          connection.query("INSERT INTO employee SET ?", [answer], function (err) {
            if (err) throw err;
            console.log("Success");
            startApp();
          });
        });
      });
    });
}

updateEmployeeRole = () => {
    connection.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        let roles = res.map((role) => ({name: role.title, value: role.role_id }));
        connection.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            let employees = res.map((x) => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: 'Which employee would you like to update the role for?',
                    choices: employees
                },
                {
                    name: 'newRole',
                    type: 'list',
                    message: 'What should the employee\'s new role be?',
                    choices: roles
                },
            ]).then((response) => {
                connection.query(`UPDATE employee SET ? WHERE ?`, 
                [
                    {
                        role_id: response.newRole,
                    },
                    {
                        id: response.employee,
                    },
                ], 
                (err, res) => {
                    if (err) throw err;
                    console.log("Success");
                    startApp();
                })
            })
        })
    })
}