const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { inherits } = require("util");

const myTeam = [];
let employeeId = 101;
let mgrDone = false;
let entryDone = false; 



// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

function loadEmployee(teamMember) {
  myTeam.push(teamMember);
  console.log('My Team');
  console.log(myTeam);
}

function promptUser(theRole) {
  console.log(theRole);
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: `${theRole}s name?`,
    },
    {
      type: "input",
      name: "email",
      message: `${theRole}s email?`,
    },
    {
      type: "input",
      name: "id",
      message: `${theRole}s employee ID?: `,
      default: employeeId,

    },
    {
      type: "input",
      name: "officeNumber",
      message: "Manager office number?",
      when: theRole === 'Manager',
    },
    {
      type: "input",
      name: "github",
      message: "Engineers Github ID?",
      when: theRole === 'Engineer',
    },
    {
      type: "input",
      name: "school",
      message: "Interns School?",
      when: theRole === 'Intern',
    },
  ]);
}

function addTeamMember() {
  return inquirer.prompt([
    {
      // this should be choose from a list 
      type: "list",
      message: "Add another?",
      name: "role",
      choices: [
        'Engineer',
        'Intern',
        'Done',
       ],
    }
  ])

}


// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

async function buildTeam() {
  try {
    // start with the manager
    const answers = await promptUser("Manager");
    const manager =  new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
    // console.log(manager);
    // push manager object to myTeam array
    loadEmployee(manager);
    mgrDone = true;
    const teamMember = await addTeamMember();

    switch (teamMember.role) {
      case 'Engineer':
        const answersE = await promptUser(teamMember.role);
        const engineer = new Engineer(answersE.name, answersE.id, answersE.email, answersE.github);
        console.log(engineer);
        break;
      case 'Intern':
        const answersI = await promptUser(teamMember.role);
        const intern = new Intern(answersI.name, answersI.id, answersI.email, answersI.school);
        console.log(intern);
        // loadEmployee(new engineer or intern object object);  
        break;
    
      default:
        entryDone = true;
        console.log("Done entering employee data");
        // return `Done`;
        break;
    }

    console.log(teamMember);


  } catch(err) {
    console.log(err);
  }

}

async function init() {
  try {
    const teamRoster = await buildTeam();
    console.log('Team Roster');
    console.log(teamRoster);

  } catch(err) {
    console.log(err);
  }

}

init();
