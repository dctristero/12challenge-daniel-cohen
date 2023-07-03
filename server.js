const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

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
classes.class, fiefdoms.manor_name, 
concat(v.first_name, ' ', v.last_name) AS vassal_name
FROM subjects
LEFT JOIN classes ON subjects.class_id = classes.id
LEFT JOIN fiefdoms ON subjects.fiefdom_id = fiefdoms.id
LEFT JOIN subjects v ON subjects.vassal_id = v.id`


function addFiefdom(){
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What fiefdom would you like to add?',
                name: 'addFiefdom'
            },
        ])
        .then(answers => {
            db.query('INSERT INTO fiefdoms (manor_name) VALUES (?)', 
            [answers.addFiefdom], (err, dataRes) => {
                main();
            })
        })
}

function addClass(){
    inquirer
        .prompt ([
            {
                type: 'input',
                message: 'A new kind of person???',
                name: 'class'
            },
        ])
        .then(answers => {
            db.query('INSERT INTO classes (class) VALUES (?)', 
            [answers.class], (err, dataRes) => {
                main();
            })
        })
}


function addSubject(){
    db.query('SELECT * FROM fiefdoms', (err, data)=> {
        const fiefdoms = data.map(row => {
            return {name: row.manor_name, value: row.id}
         });
         db.query('SELECT * FROM classes', (err, data)=> {
            const classes = data.map(row => { 
                return {name: row.class, value: row.id}
            });
        inquirer
        .prompt ([
            {
                type: `input`,
                message: `What is the subject's first name?`,
                name: `firstName`
            },
            {
                type: `input`,
                message: `What is the subject's last name?`,
                name: `lastName`
            },
            {
               type: `input`,
               message: `How much does this subject owe?`,
               name: `debt`
           },
            {
                type: `list`,
                message: `What class of person is this?`,
                name: `classID`,
                choices: classes
            },
            {
               type: `list`,
               message: `In which fiefdom does this subject toil?`,
               name: `fiefdomID`,
               choices: fiefdoms
           },
            {
                type: `input`,
                message: `What is ID of the new subject's vassal? 
                Enter "1" for Lord Musk
                Enter "2" for Lord Odor
                Enter "3" for Lord Stink-Stench
                Enter "null" if not applicable`,
                name: `vassalID`
            }
        ])
        .then(answers => {
            db.query('INSERT INTO subjects (first_name, last_name, debt, class_id, fiefdom_id, vassal_id) VALUES (?, ?, ?, ?, ?, ?)', 
            [answers.firstName, answers.lastName, answers.debt, answers.classID, answers.classID, answers.fiefdomID, answers.vassalID], (err, dataRes) => {
                main();
            })
        })
    })
})}


function updateClass(){
   db.query("SELECT * FROM subjects", (err, data)=> {
       const subjects = data.map(row => { 
           return {name: `${row.first_name} ${row.last_name}`, value: row.id}
       });
   db.query("SELECT * FROM classes", (err, data) => {
       const newClass = data.map(row => {
           return {name: row.class, value: row.id}
       });
       console.log(subjects)
   inquirer
       .prompt([
           {
               type: "list",
               message: "Which subject's class would you like to update?",
               name: "subjectUpdate",
               choices: subjects
           },
           {
               type: "list",
               message: "What is this subject's new class?",
               name: "newClass",
               choices: newClass
           }
       ])
       .then(answers => {
           console.log(answers)
           db.query("UPDATE subjects SET class_id = ? WHERE id = ?", [answers.newClass, answers.subjectUpdate], (err, data)=> {
               main();
           })
       })
   })
})
}

function main() {
    inquirer
        .prompt([
        {
            type: 'list',
            message: 'What shall you do on this fine day?',
            name: 'action',
            choices: [
                `survey mine fiefdoms`,
                `survey the classes of mine subjects`,
                `survey mine subjects`,
                `add a fiefdom`,
                `add a class`,
                `add a subject`,
                `update a subject's class`
            ],
        },
    ])
        .then((answers)=> {
        switch (answers.action) {
            case `survey mine fiefdoms`:
                db.query(surveyMineFiefdoms, (err, dataRes) => {
                    console.table(dataRes);
                    main();
                });
                break;
            case `survey the classes of mine subjects`:
                db.query(surveyClasses, (err, dataRes) => {
                    console.table(dataRes);
                    main();
                });
                break;
            case `survey mine subjects`:
                db.query(surveyMineSubjects, (err, dataRes) => {
                    console.table(dataRes);
                    main();
                });
                break;
            case `add a fiefdom`:
                addFiefdom();
                break;
            case `add a class`:
                addClass();
                break;
            case `add a subject`:
                addSubject();
                break;
            case `update a subject's class`:
                updateClass();
                break;
                default:
                    console.log(`Invalid action.`);
                    main();
                    break;
            }
        });
}
main()
