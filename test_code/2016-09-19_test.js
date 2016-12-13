#!/usr/bin/env node
/**
 *	@author Stewart Johnston <johnstons1@student.ncmich.edu>
 *	@version 2016.09.19.01
 *	@summary Test file | created 2016-09-19
 *	@todo
 */

"use strict";
const PROMPT = require('readline-sync');

let numShoes;
let lastName, firstName;

function main(){
	setNumShoes();
	setFirstName();
	setLastName();
	printNumShoes();
	printName();
}

main();

function setNumShoes(){
	numShoes = PROMPT.question('\nEnter the number of shoes: ');
}

function printNumShoes(){
	console.log(`The number of shoes is ${numShoes}`);
}

function setFirstName(){
	firstName = PROMPT.question('\nEnter your first name: ');
}

function setLastName(){
	lastName = PROMPT.question('\nEnter your last name: ');
}

function printName(){
	console.log(`Your name is ${firstName} ${lastName}`);
}
