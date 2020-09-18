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
const { memory } = require("console");

const myTeam = [];
let employeeId = 101;
let mgrDone = false;
let entryDone = false; 


function loadEmployee(teamMember) {
  myTeam.push(teamMember);
  console.log('My Team');
  console.log(myTeam);
  employeeId++;
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

async function buildTeam() {
  try {
    // start with the manager
   
    if (!mgrDone){
      const answers = await promptUser("Manager");
      const manager =  new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
      console.log(manager);
      // myTeam.push(manager);
      loadEmployee(manager);
      mgrDone = true;
    } 

    const teamMember = await addTeamMember();

    if (teamMember.role == "Engineer"){
      const answersE = await promptUser("Engineer");
      const engineer = new Engineer(answersE.name, answersE.id, answersE.email, answersE.github);
      console.log(engineer);
      // myTeam.push(engineer);
      loadEmployee(engineer);
      buildTeam();
    } 
    
    if (teamMember.role == "Intern"){
      const answersI = await promptUser("Intern");
      const intern = new Intern(answersI.name, answersI.id, answersI.email, answersI.school);
      console.log(intern);
      // myTeam.push(intern);
      loadEmployee(intern);
      buildTeam();
    }  
    
    if (teamMember.role == "Done") {
      console.log("done adding employees");
      fs.writeFileSync(outputPath, render(myTeam), "utf-8");
    }

  } catch(err) {
    console.log(err);
  }

}

async function init() {
  try {
    buildTeam();
    

  } catch(err) {
    console.log(err);
  }

}

init();
