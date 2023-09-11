// import readline from 'node:readline'
// import PromptAssync from './PromptAssync.js';


//solution using recursion

// const readlineInterface = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
// let number = 5;

// function game(){
//   readlineInterface.question("Enter number from 1 to 10: ", num => {
//     if (num != number) {
//       console.log("Wrong number");
//       game();
//     }else{
//       console.log('Congratulations!');
//       readlineInterface.close();
//     }
//   })
// }
// game();
 
 //solution using Promise

 
import { PromptAsync } from "./PromptAssync.js";
import { PromptHandler } from "./promptHandler.js";

let promptAsync = new PromptAsync();
const handler = new PromptHandler(promptAsync);
asyncTyping().then(() => console.log("Thanks and Bye"));
console.log("\nexample of asynchronous console input");

async function asyncTyping() {

    let num1, num2, num3;
    let appleOrange;
    let employee;
    num1 = await promptAsync.readNumber("Enter a number from 1 to 10", 1, 10);

    if (num1) {
        num2 = await promptAsync.readNumber("Enter any number");
        num3 = await promptAsync.readNumber("Enter any positive number", 1);
        if (num3) {
            promptAsync.emit('positive', num3);
        }
        appleOrange = await promptAsync.readPredicate("Enter either apple or orange", "neither apple nor orange", answer => answer == 'apple' || answer == 'orange');
        employee = await promptAsync.readObject("Enter employee <id>#<name>#salary", answer => {
            const tokens = answer.split('#');
            if (tokens.length != 3) {
                throw 'wrong format, usage: <id>#<name>#salary';
            }
            const id = tokens[0];
            const name = tokens[1];
            const salary = +tokens[2];
            if (isNaN(salary) || salary < 5000 || salary > 50000) {
                throw `Salary should be a number in the range[5000-50000]`;
            }
            return { id, name, salary };
        });
        console.log(`num1=${num1}, num2=${num2}, num3=${num3}, appleOrange=${appleOrange},
 employee=${JSON.stringify(employee)}`);

    }
    promptAsync.close();
}
