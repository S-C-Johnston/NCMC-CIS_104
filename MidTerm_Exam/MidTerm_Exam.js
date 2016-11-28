/**
 *	@author: Stewart Johnston <johnstons1@student.ncmich.edu>
 *	@version: 2016.11.27.01
 *	@summary: Midterm Exam, ATM simulator | Created 2016-11-27
 *	@todo: everything
 */

"use strict";
const PROMPT = require('readline-sync');

const ACCOUNT_DEFAULT_INIT = 1000;

let bDoContinue;

function main() {
	printGreeting();
	(function mainLoop(){

	})();
	printGoodbye();
}

main();

function printGreeting() {
	console.log(`\nWelcome to the Simulatron ATM, for all your simulated banking needs`);
}

function printGoodbye() {
	console.log(`\nThanks for using the Simulatron ATM. Don't spend it all in one place, now.`);
}
