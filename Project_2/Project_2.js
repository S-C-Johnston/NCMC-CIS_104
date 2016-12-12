#!/usr/bin/env node
// jshint esversion: 6
/**
 * @author: Stewart Johnston <johnstons1@student.ncmich.edu>
 * @summary: Drive-rite insurance agnecy premium calculator | Created 2016-10-10
 * @version: 1.0.1 | 1.0 deemed feature complete
 * @todo:
 */ 

"use strict";
const PROMPT = require('readline-sync');

let policyNumber, numAtFaultAccidents, monthlyInsPremium;
let nameLast, nameFirst;
let customerBirthYear, premiumDueDate;

const	BASE_PRICE = 100,
	PRICE_YOUNG_ADULT = 20,
	YOUNG_ADULT_MIN = 16,
	YOUNG_ADULT_MAX = 29,
	PRICE_ADULT = 10,
	ADULT_MIN = 30,
	ADULT_MAX = 45,
	PRICE_SENIOR = 30,
	SENIOR_MIN = 60,
	PRICE_PER_ACCIDENT = 50,
	MONTH_MIN = 1,
	MONTH_MAX = 12,
	CURRENT_YEAR = 2016,
	MAX_VALID_BIRTH_YEAR = (CURRENT_YEAR - 115), //Earliest year in which this program assumes a person could have been born and still be driving
	MIN_VALID_BIRTH_YEAR = (CURRENT_YEAR - 16); //Most recent year in which this program assumes a person could have been born and now driving

const	MESSAGE_INVALID_NUMBER = 'The input you entered was not a valid number, please try again.',
	MESSAGE_YEAR_OOB = 'The year you entered was outside of valid bounds, please try again.';

function main() {
	printGreeting();
	(function mainLoop(doContinue){
		if (undefined === doContinue) {
			doContinue = true;
		}

		if (false === doContinue) {
			return;
		}

		setPolicyNumber();
		setPremiumDueDate();
		setNameLast();
		setNameFirst();
		setCustomerBirthYear();
		setNumAtFaultAccidents();
		calcMonthlyInsPremium();
		printMonthlyInsPremium();
		doContinue = setDoContinue();
		return mainLoop(doContinue);
	})();
	printGoodbye();
}

main();

function setDoContinue() {
	let userAnswer = PROMPT.question(`\nDo you want to continue? 0 = no, non-zero = yes : `);
	let boolContinue = ((0 == userAnswer) ? Boolean(Number(userAnswer)) : Boolean(userAnswer)); //jshint ignore:line
	return boolContinue;
}

function printGreeting() {
	console.log(`\nWelcome to the Drive-Rite Insurance Premium tool.`);
}

function printGoodbye() {
	console.log(`\nThank you for using the Drive-Rite Insurance Premium tool!`);
}

function printMonthlyInsPremium() {
	console.log(`\n\nWith the details provided, the invoice details are as follows:`);
	console.log(`\nMonthly Insurance Premium: \$${monthlyInsPremium}`);
	console.log(`\nPolicy number: ${policyNumber}`);
	console.log(`\nPremium due date: ${premiumDueDate}`);
	console.log(`\nCustomer name: ${nameFirst} ${nameLast}`);
	console.log(`\nCustomer birth year: ${customerBirthYear}`);
	console.log(`\nNumber of at-fault accidents in the last three years: ${numAtFaultAccidents}`);
}

function setPolicyNumber() {
	policyNumber = Math.floor(Number(PROMPT.question(`\nPlease type your policy number: `)));
	if (isNaN(policyNumber)) {
		console.log(`\n${MESSAGE_INVALID_NUMBER}`);
		return setPolicyNumber();
	}
}

function setNumAtFaultAccidents() {
	numAtFaultAccidents = Math.floor(Number(PROMPT.question(`\nPlease enter the number of at-fault accidents in the last three years: `)));
	if (isNaN(numAtFaultAccidents)) {
		console.log(`\n${MESSAGE_INVALID_NUMBER}`);
		return setNumAtFaultAccidents();
	}
}

function validateNumBetween(min, num, max) {
	if (min <= num && num <= max) {
		return true;
	}
	else {
		return false;
	}
}

function setNameFirst() {
	nameFirst = PROMPT.question(`\nPlease enter your first name: `);
}

function setNameLast() {
	nameLast = PROMPT.question(`\nPlease enter your last name: `);
}

function setCustomerBirthYear() {
	customerBirthYear = Math.floor(Number(PROMPT.question(`\nPlease enter the year you were born: `)));
	if (isNaN(customerBirthYear)) {
		console.log(`\n${MESSAGE_INVALID_NUMBER}`);
		return setCustomerBirthYear();
	}
	if (true === validateNumBetween(MAX_VALID_BIRTH_YEAR, customerBirthYear, MIN_VALID_BIRTH_YEAR)) {
		return customerBirthYear;
	}
	else {
		console.log(`\n${MESSAGE_YEAR_OOB}`);
		return setCustomerBirthYear();
	}
}

function setAndValidateMonth() { //Helper for setPremiumDueDate
	let month = Math.floor(Number(PROMPT.question(`\nEnter month, numeric: `)));
	if (isNaN(month)) {
		console.log(`\n${MESSAGE_INVALID_NUMBER}`);
		return setAndValidateMonth();
	}
	else if (false === validateNumBetween(MONTH_MIN, month, MONTH_MAX)) {
		console.log(`\nThe month you entered was out of valid bounds, please try again.`);
		return setAndValidateMonth();
	}
	return month;
}

function setAndValidateDay(year, month) { //Helper for setPremiumDueDate
	let MESSAGE_INVALID_DAY = 'The day you entered was not valid for the month';
	let MESSAGE_TRY_AGAIN = 'Please try again.';

	let isLeapYear;
	if (0 !== (year % 4)) {
		isLeapYear = false;
	}
	else if (0 !== (year % 100)) {
		isLeapYear = true;
	}
	else if (0 !== (year % 400)) {
		isLeapYear = false;
	}
	else {
		isLeapYear = true;
	}

	let day = Math.floor(Number(PROMPT.question(`\nEnter day, numeric: `)));
	if (isNaN(day)) {
		console.log(`\n${MESSAGE_INVALID_NUMBER}`);
		return setAndValidateDay(year, month);
	}

	if ([1,3,5,7,8,10,12].indexOf(month) > -1) { //stackoverflow.com/questions/4728144/
		if (false === validateNumBetween(1, day, 31)) {
			console.log(`\n${MESSAGE_INVALID_DAY} ${month}. ${MESSAGE_TRY_AGAIN}`);
			return setAndValidateDay(year, month);
		}
	}
	else if ([4,6,9,11].indexOf(month) > -1) {
		if (false === validateNumBetween(1, day, 30)) {
			console.log(`\n${MESSAGE_INVALID_DAY} ${month}. ${MESSAGE_TRY_AGAIN}`);
			return setAndValidateDay(year, month);
		}
	}
	else {
		if (false === isLeapYear) {
			if (false === validateNumBetween(1, day, 28)) {
				console.log(`\n${MESSAGE_INVALID_DAY} ${month}. ${MESSAGE_TRY_AGAIN}`);
				return setAndValidateDay(year, month);
			}
		}
		else {
			if (false === validateNumBetween(1, day, 29)) {
				console.log(`\n${MESSAGE_INVALID_DAY} ${month}. ${MESSAGE_TRY_AGAIN}`);
				return setAndValidateDay(year, month);
			}
		}
	}

	return day;
}

function setAndValidateYear() { //Helper for setPremiumDueDate
	let year = Math.floor(Number(PROMPT.question(`\nEnter year, numeric: `)));
	if (isNaN(year)) {
		console.log(`\n${MESSAGE_INVALID_NUMBER}`);
		return setAndValidateYear();
	}
	else if (false === validateNumBetween(CURRENT_YEAR, year, (CURRENT_YEAR + 1))) {
		console.log(`\n${MESSAGE_YEAR_OOB}`);
		return setAndValidateYear();
	}
	return year;
}

function setPremiumDueDate() {
	console.log(`\nThe next three questions are to set the premium due date.`);
	let year = setAndValidateYear();
	let month = setAndValidateMonth();
	let day = setAndValidateDay(year, month);

	premiumDueDate = `${year}-${month}-${day}`;
}

function calcMonthlyInsPremium() {
	monthlyInsPremium = BASE_PRICE;

	let customerAge = (CURRENT_YEAR - customerBirthYear);

	if (true === validateNumBetween(YOUNG_ADULT_MIN, customerAge, YOUNG_ADULT_MAX)) {
		monthlyInsPremium += PRICE_YOUNG_ADULT;
	}
	else if (true === validateNumBetween(ADULT_MIN, customerAge, ADULT_MAX)) {
		monthlyInsPremium += PRICE_ADULT;
	}
	else if (SENIOR_MIN <= customerAge) {
		monthlyInsPremium += PRICE_SENIOR;
	}

	monthlyInsPremium += (numAtFaultAccidents * PRICE_PER_ACCIDENT);
}
