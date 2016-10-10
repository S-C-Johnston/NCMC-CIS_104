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
let customerBirthdate, premiumDueDate;
const	BASE_PRICE = 100,
	PRICE_TWIXT_15_30 = 20,
	PRICE_TWIXT_30_45 = 10,
	PRICE_GT_60 = 30,
	PRICE_PER_ACCIDENT = 50;

function main() {
}

main();

function setPolicyNumber() {
	policyNumber = PROMPT.question(`\nPlease type your policy number: `);
}

function setNumAtFaultAccidents() {
	numAtFaultAccidents = PROMPT.question(`\nPlease enter the number of at-fault accidents in the last three years: `);
}

function setNameFirst() {
}

function setNameLast() {
}
