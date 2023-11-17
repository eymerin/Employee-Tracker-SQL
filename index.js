const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Barebuttballsnback1!',
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
                addADepartment();
            break;

            case "Add a role":
                addARole();
            break;

            case "Add an employee":
                addAnEmployee();
            break;

            case "Update employee's role":
                updateEmployeeRole();
            break;

            case "Update employee's manager":
                updateEmployeesManager();
            break;

            case "Remove a department":
                removeADepartment();
            break;

            case "Remove a role":
                removeARole();
            break;

            case "Remove an employee":
                removeAnEmployee();
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
    connection.query(`SELECT * FROM department ORDER BY department.id ASC;`, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.table(res[i].name);
        }
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

addADepartment = () => {
    inquirer.prompt([
        {
        name: 'newDept',
        type: 'input',
        message: 'What is the name of the new department?'   
        }
    ]).then((response) => {
        connection.query(`INSERT INTO department SET ?`, 
        {
            department_name: response.newDept,
        },
        (err, res) => {
            if (err) throw err;
            console.log(`\n ${response.newDept} has been added! \n`);
            startApp();
        })
    })
};

addARole = () => {
    connection.query(`SELECT * FROM department;`, (err, res) => {
        if (err) throw err;
        let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
        inquirer.prompt([
            {
            name: 'title',
            type: 'input',
            message: 'What is the name of the new role?'   
            },
            {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the new role?'   
            },
            {
            name: 'deptName',
            type: 'list',
            message: 'To which department do you want to add the new role?',
            choices: departments
            },
        ]).then((response) => {
            connection.query(`INSERT INTO role SET ?`, 
            {
                title: response.title,
                salary: response.salary,
                department_id: response.deptName,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`\n ${response.title} has been added! \n`);
                startApp();
            })
        })
    })
};

addAnEmployee = () => {
    connection.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        connection.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id}));
            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: "What is the new employee's first name?"
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: "What is the new employee's last name?"
                },
                {
                    name: 'role',
                    type: 'list',
                    message: "What is the new employee's role?",
                    choices: roles
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: "Who is the new employee's manager?",
                    choices: employees
                }
            ]).then((response) => {
                connection.query(`INSERT INTO employee SET ?`, 
                {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: response.role,
                    manager_id: response.manager,
                }, 
                (err, res) => {
                    if (err) throw err;
                })
                connection.query(`INSERT INTO role SET ?`, 
                {
                    department_id: response.dept,
                }, 
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n ${response.firstName} ${response.lastName} has been added! \n`);
                    startApp();
                })
            })
        })
    })
};

updateEmployeeRole = () => {
    connection.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        connection.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
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
                        employee_id: response.employee,
                    },
                ], 
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n Successfully updated employee's role! \n`);
                    startApp();
                })
            })
        })
    })
}

updateEmployeesManager = () => {
    connection.query(`SELECT * FROM employee;`, (err, res) => {
        if (err) throw err;
        let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee would you like to update the manager for?',
                choices: employees
            },
            {
                name: 'newManager',
                type: 'list',
                message: 'Who should the employee\'s new manager be?',
                choices: employees
            },
        ]).then((response) => {
            connection.query(`UPDATE employee SET ? WHERE ?`, 
            [
                {
                    manager_id: response.newManager,
                },
                {
                    employee_id: response.employee,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully updated employee's manager! \n`);
                startApp();
            })
        })
    })
};

removeADepartment = () => {
    connection.query(`SELECT * FROM department ORDER BY department_id ASC;`, (err, res) => {
        if (err) throw err;
        let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
        inquirer.prompt([
            {
            name: 'deptName',
            type: 'list',
            message: 'Which department would you like to remove?',
            choices: departments
            },
        ]).then((response) => {
            connection.query(`DELETE FROM department WHERE ?`, 
            [
                {
                    department_id: response.deptName,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully removed the department! \n`);
                startApp();
            })
        })
    })
}

removeARole = () => {
    connection.query(`SELECT * FROM role ORDER BY role_id ASC;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        inquirer.prompt([
            {
            name: 'title',
            type: 'list',
            message: 'Which role would you like to remove?',
            choices: roles
            },
        ]).then((response) => {
            connection.query(`DELETE FROM role WHERE ?`, 
            [
                {
                    role_id: response.title,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully removed the role! \n`);
                startApp();
            })
        })
    })
}

removeAnEmployee = () => {
    connection.query(`SELECT * FROM employee ORDER BY employee_id ASC;`, (err, res) => {
        if (err) throw err;
        let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee would you like to remove?',
                choices: employees
            },
        ]).then((response) => {
            connection.query(`DELETE FROM employee WHERE ?`, 
            [
                {
                    employee_id: response.employee,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully removed the employee! \n`);
                startApp();
            })
        })
    })
}

