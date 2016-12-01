#!/usr/bin/env node
/**
 *	@author: Stewart Johnston <johnstons1@student.ncmich.edu>
 *	@version: 2016.11.27.04
 *	@summary: Midterm Exam, ATM simulator | Created 2016-11-27
 *	@todo: everything
 *	Really, though, for something like this you'd want to modify real values
 *	somewhere, not dummy values limited to the scope of the program.
 */

"use strict";
const PROMPT = require('readline-sync');

const ACCOUNT_BALANCE_INIT = 1000;

const PRE_BAKED_USER_NAME = "Charlie Chaplin",
PRE_BAKED_USER_NUM = 1111122213331444, // A card number
PRE_BAKED_USER_PIN = 1234; // Obviously not a good example of security

const RGX_ENG_NOUN_30 = /^[a-zA-Z0-9 ]{1,30}$/,
      RGX_ENG_NOUN_60 = /^[a-zA-Z0-9 ]{1,60}$/;

function main() {
	printGreeting();
	let userName;
	let cardNumber;
	let bLoggedIn = false;
	setUserDetails();
	let userSavingsBalance = ACCOUNT_BALANCE_INIT; //Obviously not how this would be done properly
	let userCheckingBalance = ACCOUNT_BALANCE_INIT;
	(function mainLoop(){
		if (false === bLoggedIn) { // Just in case. 
			return;
		}

		console.log(`\n 0: Logout`); // Exit the program
		console.log(`\n 1: Inquire to account status`);
		console.log(`\n 2: Deposit`);
		console.log(`\n 3: Withdraw`);
		console.log(`\n 4: Transfer funds out`);
		userChoice = PROMPT.question(`\nPlease make a choice, numeric: `);

		if (Number.isNaN(userChoice)) {
			console.log(`\nThat was not a valid numeric choice, please try again.`);
			return mainLoop();
		}

		userChoice = Number(userChoice);

		switch (userChoice) {
		  case 0:
			console.log(`\nYou have chosen to logout by choosing something equivalent to zero. If you believe this is in error, please contact Simulatron customer support.`);
			process.exit();
			break;
		  case 1:
			console.log(`\nSavings: ${userSavingsBalance} Checking: ${userCheckingBalance}`);
			break;
		}

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

function setUserDetails() {
	userName = setUserName();
	cardNumber = setCardNum();
	if (PRE_BAKED_USER_NAME !== userName
	   || PRE_BAKED_USER_NUM !== (Number(cardNumber.replace(' ', ''))) {
		console.log(`\nSorry, no user with that name and card could be found. Please try again.`);
		userName = null;
		cardNumber = null;
		return setUserDetails();
	}

	bLoggedIn = authCredentials();
}

function setUserName() {
	let lUserName = PROMPT.question(`\nPlease enter your whole name: `);

	if (false === RGX_ENG_NOUN_60.test(lUserName) {
		console.log(`\nThat is not a valid name or noun, please try again.`);
		return setUserName();
	}

	return lUserName;
}

function setCardNum() {
	let lCardNumber = PROMPT.question(`\nPlease enter your card number: `);

	if (false === (/^[0-9 ]{16,}$/.test(lCardNumber) )) {
		console.log(`\nThat is not a valid card number, please try again.`);
		return setCardNum();
	}

	return lCardNum;
}

function authCredentials(numTries) {
	const MAX_TRIES = 3;
	if (undefined === numTries) {
		numTries = 0;
	}

	if (MAX_TRIES =< numTries) {
		process.exit(); /* Crude, but theoretically functional
				 * Program should be able to just clear out to main and loop from that scope
				 */
	}

	let lUserPIN = Math.floor(Number(PROMPT.question(`\nPlease enter your PIN: `)));

	if (Number.isNaN(lUserPIN)) {
		console.log(`\nThat was not a valid numeric PIN format, please try again.`);
		return authCredentials(numTries);
	}

	if (PRE_BAKED_USER_PIN !== (Number(lUserPIN))) {
		let triesRemaining = (MAX_TRIES - numTries);
		console.log(`\nThat PIN was not correct, you have ${triesRemaining} tries remaining.`);
		numTries++;
		return authCredentials(numTries);
	}
	
	return true;
}
