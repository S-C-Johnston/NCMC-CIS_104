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
	let userSavingsBalance;
	let userCheckingBalance;
	initAccounts();
	(function mainLoop(){
		if (false === bLoggedIn) { // Just in case. 
			return;
		}

		printMainMenu();
		let choiceHolder = getMainMenuChoice();

		let mainMenuChoice;
		(false !== choiceHolder) ? mainMenuChoice = choiceHolder : return mainLoop();

		interpMainMenuChoice(mainMenuChoice);

	})();
	printGoodbye();
}

main();

function printMainMenu() {
	console.log(`\n 0: Logout`); // Exit the program
	console.log(`\n 1: Inquire to account status`);
	console.log(`\n 2: Deposit`);
	console.log(`\n 3: Withdraw`);
	console.log(`\n 4: Transfer funds out`);
}

function getMainMenuChoice() {
	let lUserChoice = PROMPT.question(`\nPlease make a choice, numeric: `);

	if (Number.isNaN(lUserChoice)) {
		console.log(`\nThat was not a valid numeric choice, please try again.`);
		return false;
	}

	return lUserChoice;
}

function interpMainMenuChoice(lUserChoice) {
	switch (lUserChoice) {
	  case 0:
		console.log(`\nYou have chosen to logout by choosing something equivalent to zero. If you believe this is in error, please contact Simulatron customer support.`);
		process.exit();
		break;
	  case 1:
		let savingsBal = getAccountBalance(savings01);
		let checkingBal = getAccountBalance(checking01);
		console.log(`\nSavings: ${savingsBal} Checking: ${checkingBal}`);
		break;
	  case 2:
		console.log(`\nYou've chosen to deposit into an account.`);
		opt2Deposit();
		break;
	  case 3:
		console.log(`\nYou've chosen to withdraw from an account.`);
		opt3Withdraw();
		break;
	}
}

function opt2Deposit() {
	let lUserChoice = accountTypePrompt();

	let depositSum = setTransactionAmount();

	console.log(`\nNoting deposit of ${depositSum} and recording the change.`);
	switch (lUserChoice) {
	  case 1:
		modAccountBalance(savings01, depositSum);
		break;
	  case 2:
		modAccountBalance(Checking01, depositSum);
		break;
	}
	console.log(`\nDeposit successful.`);
}

function opt3Withdraw() { //Pretending we're dispensing money in $10 increments
	const WITHDRAW_INCREMENT = 10;
	let lUserChoice = accountTypePrompt();

	console.log(`\nPlease use exact multiples of ${WITHDRAW_INCREMENT}`);
	let withdrawSum = (setTransactionAmount());
	if (0 !== (withdrawSum % WITHDRAW_INCREMENT)) {
		console.log(`\nThat was not a valid withdraw value for this machine, please try again.`);
		return opt3Withdraw();
	}
	withdrawSum = (-withdrawSum);

	console.log(`\nNoting withdraw sum of ${withdrawSum} and recording the change. Retrieve your bills below.`);

	switch (lUserChoice) {
	  case 1:
		modAccountBalance(savings01, withdrawSum);
		break;
	  case 2:
		modAccountBalance(Checking01, withdrawSum);
		break;
	}
	console.log(`\nWithdraw successful. If there was any problem, please report it to Simulatron customer support.`);
}

function setTransactionAmount() {
	let transactionAmount = PROMPT.question(`\nEnter transaction amount: $`);

	if (Number.isNaN(transactionAmount)) {
		console.log(`\nThat was not a valid dollar value, please try again.`);
		return setTransactionAmount();
	}

	transactionAmount = Math.abs(transactionAmount);
	return transactionAmount;
}

function accountTypePrompt() {
	let lUserChoice = PROMPT.question(`\nWhich account? 1: Savings, 2: Checking`);

	if (Number.isNaN(lUserChoice)) {
		console.log(`\nThat was not a valid numeric choice, please try again.`);
		return accountTypePrompt;
	}

	return lUserChoice;
}

function modAccountBalance(accountType, amount) {
	if (undefined === accountType || Number.isNaN(amount)) {
		console.log(`\nInput was not valid. Something went wrong!`);
		process.exit(); //For lack of the knowledge on how to properly handle exceptions
	}

	switch(accountType) {
	  case savings01:
		userSavingsBalance += amount;
		break;
	  case checking01:
		userCheckingBalance += amount;
		break;
	  case default:
		console.log(`\n${accountType} not recognized. Something went wrong!`);
		break;
	}
}

function initAccounts() {
	userSavingsBalance = ACCOUNT_BALANCE_INIT; //Obviously not how this would be done properly
	userCheckingBalance = ACCOUNT_BALANCE_INIT;
}

function getAccountBalance(accountType) {
	switch(accountType) {
	  case savings01:
		return userSavingsBalance;
		break;
	  case checking01:
		return userCheckingBalance;
		break;
	  case default:
		return (userSavingsBalance, userCheckingBalance);
		break;
	}
}

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
