const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
   host:'localhost',
   user: 'root',
   password: 'mmmmm',
   database: 'subjects_db'
});

const surveyMineFiefdoms =
`SELECT fiefdoms.manor_name
    FROM fiefdoms`;

const surveyClasses =
`SELECT classes.class
    FROM classes`;

const surveyMineSubjects =
`SELECT subjects.first_name, subjects.last_name, subjects.debt, 
classes.class, 
fiefdoms.manor_name, 
concat(subjects.first_name, ' ', subjects.last_name) AS manager_name
FROM subjects 
LEFT JOIN class ON e.role_id = r.id
LEFT JOIN fiefdoms ON r.department_id = d.id
LEFT JOIN employee m ON e.manager_id = m.id`

// Function to add a department 
function addDepartment(){
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What department would you like to add?',
                name: 'addDep'
            },
        ])
        .then(answers => {
            db.query('INSERT INTO DEPARTMENT (department_name) VALUES (?)', 
            [answers.addDep], (err, dataRes) => {
                main();
            })
        })
}

// Function to add a role
function addRole(){
    inquirer
        .prompt ([
            {
                type: 'input',
                message: 'What is the title of the role would you like to add?',
                name: 'role'
            },
            {
                type: 'input',
                message: 'What is the annual salary for this role?',
                name: 'salary'
            },
            {
                type: 'input',
                message: 'What is the department ID?',
                name: 'deptId'
            }
        ])
        .then(answers => {
            db.query('INSERT INTO ROLE (title, salary, department_id) VALUES (?, ?, ?)', 
            [answers.role, answers.salary, answers.deptId], (err, dataRes) => {
                main();
            })
        })
}


// Function to add a employee
function addEmployee(){
    db.query('SELECT * FROM ROLE', (err, data)=> {
        const roles = data.map(row => {
            return {name: row.title, value: row.id}
        })
        inquirer
        .prompt ([
            {
                type: 'input',
                message: 'What is the employees first name?',
                name: 'firstName'
            },
            {
                type: 'input',
                message: 'What is the employees last name?',
                name: 'lastName'
            },
            {
                type: 'list',
                message: 'Please enter new employee role ID',
                name: 'roleId',
                choices: roles
            },
            {
                type: 'input',
                message: 'What is the manager id? (if manager enter NULL)',
                name: 'managerId'
            }
        ])
        .then(answers => {
            db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
            [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err, dataRes) => {
                main();
            })
        })
    })
}

// Function to update a role
function updateRole(){
    db.query('SELECT * FROM employee', (err, data)=> {
        const employees = data.map(row => { 
            return {name: `${row.first_name} ${row.last_name}`, value: row.id}
        });
    db.query('SELECT * FROM role', (err, data) => {
        const newRole = data.map(row => {
            return {name: row.title, value: row.id}
        });
        console.log(employees)
    inquirer
        .prompt([
            {
                type: 'list',
                message: "Which employee's role would you like to update?",
                name: 'employeeUpdate',
                choices: employees
            },
            {
                type: 'list',
                message: 'What role would you like to assign the selected employee?',
                name: 'newRole',
                choices: newRole
            }
        ])
        .then(answers => {
            console.log(answers)
            db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.newRole, answers.employeeUpdate], (err, data)=> {
                main();
            })
        })
    })
})
}

// Main function called in program, gives the user a list of choices
function main() {
    inquirer
        .prompt([
        {
            type: 'list',
            message: 'What would you like to choose?',
            name: 'action',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update a employee role'
            ],
        },
    ])
        .then((answers)=> {
        switch (answers.action) {
            case "view all departments":
                db.query("SELECT * FROM department;", (err, dataRes) => {
                    console.table(dataRes);
                    main();
                });
                break;
            case "view all roles":
                db.query(viewRolesQuery, (err, dataRes) => {
                    console.table(dataRes);
                    main();
                });
                break;
            case "view all employees":
                db.query(viewEmployeeQuery, (err, dataRes) => {
                    console.table(dataRes);
                    main();
                });
                break;
            case "add a department":
                addDepartment();
                break;
            case "add a role":
                addRole();
                break;
            case "add an employee":
                addEmployee();
                break;
            case "update a employee role":
                updateRole();
                break;
                default:
                    console.log("Invalid action.");
                    main();
                    break;
            }
        });
}
main()
