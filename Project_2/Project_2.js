#!/usr/bin/env node
/**
 *	@author: Stewart Johnston <johnstons1@student.ncmich.edu>
 *	@Summary: Drive-rite insurance agnecy premium calculator | Created 2016-10-10
 *	@version: 2016.10.10.01
 *	@todo: 
 */ 

"use strict";
const PROMPT = require('readline-sync');

let policyNumber, numAtFaultAccidents;
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
	CURRENT_YEAR = 2016,
	MAX_VALID_BIRTH_YEAR = (CURRENT_YEAR - 115), //Earliest year in which this program assumes a person could have been born and still be driving
	MIN_VALID_BIRTH_YEAR = (CURRENT_YEAR - 16); //Most recent year in which this program assumes a person could have been born and now driving

const	MESSAGE_INVALID_NUMBER = 'The input you entered was not a valid number, please try again.';
	MESSAGE_YEAR_OOB = 'The year you entered was outside of valid bounds, please try again.';

function main() {
}

main();

function setPolicyNumber() {
	policyNumber = Number(PROMPT.question(`\nPlease type your policy number: `));
	if (Number.isNaN(policyNumber)) {
		console.log(`\n${MESSAGE_INVALID_NUMBER}`);
		return setPolicyNumber();
	}
}

function setNumAtFaultAccidents() {
	numAtFaultAccidents = Number(PROMPT.question(`\nPlease enter the number of at-fault accidents in the last three years: `));
	if (Number.isNaN(numAtFaultAccidents)) {
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
	customerBirthYear = Number(PROMPT.question(\nPlease enter the year you were born: ));
	if (Number.isNaN(customerBirthYear)) {
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
}

function setAndValidateDay(month, year) { //Helper for setPremiumDueDate
	
}

function setAndValidateYear() { //Helper for setPremiumDueDate
	year = Number(PROMPT.question(`\nEnter year, numeric: `));
	if (Number.isNaN(year)) {
		console.log(`\n${MESSAGE_INVALID_NUMBER}`);
		return setAndValidateYear();
	}
	else if (CURRENT_YEAR > year) {
		console.log(`\n${MESSAGE_YEAR_OOB}`);
		return setAndValidateYear();
	}
	return year;
}

function setPremiumDueDate() {
}
