#!/usr/bin/env node
// jshint esversion: 6
/**
 * @author: Stewart Johnston <johnstons1@student.ncmich.edu>
 * @summary: DIE ROLLA, a dice roller | Created 2016-12-16
 * @version: 2016.12.16.29
 * @todo: Regex for die notation
 */

"use strict";
const PROMPT = require('readline-sync');

const CLI_SHORT_PER_ROLL = "-p",
      CLI_LONG_PER_ROLL = "--per-roll",
      CLI_SHORT_PRINT_SUM = "-s",
      CLI_LONG_PRINT_SUM = "--sum",
      CLI_SHORT_HELP = "-h",
      CLI_LONG_HELP = "--help";

const SET_IDX_NAME = 0, //Name of set
      SET_IDX_NUM_ROLLS = 1, //Number of rolls in the set
      SET_IDX_P_PRINT = 2, //Per-roll value print boolean
      SET_IDX_S_PRINT = 3, //Sum value print boolean
      SET_IDX_DIE_ROLLS = 4; //Where the list of die rolls lives

const DIE_IDX_DICE = 0, //Number of dice
      DIE_IDX_SIDES = 1, //Max face value of those dice
      DIE_IDX_P_MOD = 2, //Per-roll modifier
      DIE_IDX_S_MOD = 3, //Sum modifier
      DIE_IDX_P_PRINT = 4, //Print values per roll
      DIE_IDX_S_PRINT = 5; //Print values for sum

const D4 = 4, //Pre-loaded dice face values
      D6 = 6,
      D8 = 8,
      D10 = 10,
      D12 = 12,
      D20 = 20;

const RGX_ENG_NOUN_30 = /\b[a-zA-Z0-9]{1,30}\B/,
      RGX_ENG_NOUN = RGX_ENG_NOUN_30;
      //RGX_DIE_STRING_NOTATION = //,
const DIE_STRING_SPLIT = "dps:", //Legal splits for manual input
      RGX_DIE_STRING_SPLIT = new RegExp(`[${DIE_STRING_SPLIT}]`),
      DICE_ATOM_SPLIT = (`[${DIE_STRING_SPLIT}]{1}`),
      DICE_GROUP_DIGIT = (`(${DICE_ATOM_SPLIT}[\d]*)`),
      DICE_GROUP_CHAR = (`(${DICE_ATOM_SPLIT}[\d\w]*)`),
      RGX_DICE_NOTATION = new RegExp(
	`\b[\d]+(` + //Match must start w/ some # digits. Only required portion.
	`(${DICE_GROUP_DIGIT}` +  //A group ([dps:]{1}[\d]*): require as part
//of the group exactly one field separator and zero or more digits. If no digits,
//default relevant value to zero when parsed
	`(${DICE_GROUP_DIGIT}` +
	`(${DICE_GROUP_DIGIT}` +
	`(${DICE_GROUP_CHAR}` + //A group ([dps:]{1}[\w\d]*): As above, but
//with any useful character. Non-zero will be parsed as "true" for this value.
	`(${DICE_GROUP_CHAR}` +
	`)?)?)?)?)?)?` //Optional inclusions that match up, making each group
//optional but dependent upon there being the next group in front of it.
	); //EUREKA! Ugly, but it works exactly the way I want it to.
// ^ That whole monstrosity should come out as:
// /\b[\d]+(([dps:]{1}[\d]*)(([dps:]{1}[\d]*)(([dps:]{1}[\d]*)(([dps:{1}[\w\d]*)([dps:]{1}[\w\d]*)?)?)?)?)?/
// It adequately matches the XdNpMsM:P:S notation used for user facing notation

const MENU_CANCEL_VALUE = 0;

function main() {
}

main();

function prepCLIInput() {
	let usefulInput = process.argv.slice(2);
	console.log(`${usefulInput}`);
	return usefulInput;
}

function interpCLIInput(argArray) {
	if (true === argArray.includes(`${CLI_SHORT_HELP}` || `${CLI_LONG_HELP}`)) {
		printHelp();
		process.exit();
	}
	console.log(`${argArray}`);

	let overridePrintPerRoll = false;
	let overridePrintSum = true;

	if (true === argArray.includes(`${CLI_SHORT_PER_ROLL}` || `${CLI_LONG_PER_ROLL}`)) {
		overridePrintPerRoll = true;
		overridePrintSum = false;
		let foundAt = argArray.indexOf(`${CLI_SHORT_PER_ROLL}` || `${CLI_LONG_PER_ROLL}`);
		argArray.splice(foundAt,0);
		console.log(`${argArray}`);
	}

	if (true === argArray.inludes(`${CLI_SHORT_PRINT_SUM}` || `${CLI_LONG_PRINT_SUM}`)) {
		overridePrintSum = true;
		let foundAt = argArray.indexOf(`${CLI_SHORT_PRINT_SUM}` || `${CLI_LONG_PRINT_SUM}`);
		argArray.splice(foundAt,0);
		console.log(`${argArray}`);
	}
	// Check remaining elements against regex that matches notation format, remove any that are found or error if there are none which are legal
}

function rollDiceAndPrint(lDiceArray) {
	let dice = lDiceArray[DIE_IDX_DICE];
	let sides = lDiceArray[DIE_IDX_SIDES];
	let perRollModifier = lDiceArray[DIE_IDX_P_MOD];
	let sumModifier = lDiceArray[DIE_IDX_S_MOD];
	let doPrintPerRoll = lDiceArray[DIE_IDX_P_PRINT];
	let doPrintSumValue = lDiceArray[DIE_IDX_S_PRINT];
	sides = (0 === sides) ? D6 : sides ;

	const RES_IDX_PPR = 0,
	      RES_IDX_PSV = 1,
	      RES_IDX_SUM = 2;
	let rollResults = [doPrintPerRoll,doPrintSumValue,0];

	for (let i = 0; i < dice; i++) {
		let result = randomIntInclusive(1,sides);
		result += perRollModifier;
		rollResults[RES_IDX_SUM] = (Number(rollResults[RES_IDX_SUM]) +
		               Number(result));
		rollResults.push(result);
	}
	rollResults[RES_IDX_SUM] += Number(sumModifier);

	if (0 !== doPrintPerRoll) {
		let sliceStart = (RES_IDX_SUM + 1);
		if (0 !== doPrintSumValue) {
			console.log(`\nThe rolls were: ${rollResults.slice(sliceStart)} \
The sum is ${rollResults[RES_IDX_SUM]}`);
		}
		else {
			console.log(`\nThe rolls were: ${rollResults.slice(sliceStart)}`);
		}
	}

	return rollResults;
}

function randomIntInclusive(minValue, maxValue) {
	minValue = Math.ciel(minValue);
	maxValue = Math.floor(maxValue);
	let randInt = (Math.floor(Math.random() *
	              (maxValue - minValue)) + minValue);
	return randInt;
}

function diceArrayToNotationString(lDiceArray) {
	let diceString = '';
	diceString.concat(`${lDiceArray[DIE_IDX_DICE]}`);
	diceString.concat(`d${lDiceArray[DIE_IDX_SIDES]}`);
	diceString.concat(`p${lDiceArray[DIE_IDX_P_MOD]}`);
        diceString.concat(`s${lDiceArray[DIE_IDX_S_MOD]}`);
	diceString.concat(`:${lDiceArray[DIE_IDX_P_PRINT]}`);
	diceString.concat(`:${lDiceArray[DIE_IDX_S_PRINT]}`);
	console.log(`${diceString}`);
	return diceString;
}

function diceStringToArray(lStringToSplit) {
	console.log(lStringToSplit);
	let diceArray = lStringToSplit.split(RGX_DIE_STRING_SPLIT);
	console.log(diceArray);

	let maxFields = (DIE_IDX_S_PRINT + 1);
	diceArray.length = (maxFields < diceArray.length) ?
	maxFields : diceArray.length;

	return diceArray;
}

function inputWholeNumInRange(minValue, maxValue, tries) {
	const MAX_TRIES = 3;
	if (MAX_TRIES < tries) {
		console.log(`\nThere were too many bad tries. Exiting`);
		process.exit();
	}

	let lUserInput = PROMPT.question(`\nPlease input a whole number between ${minValue} and ${maxValue} => `);

	if ((true === isNaN(lUserInput)) ||
	(lUserInput < minValue) ||
	(maxValue < lUserInput)) {
		console.log(`\nError! Your input was either not a number or out of range. Please try again.`);
		tries = (undefined !== tries) ? tries + 1 : 0 ;
		let triesLeft = (MAX_TRIES - tries);
		console.log(`You have ${triesLeft} tries remaining.`);
		inputWholeNumInRange(minValue,maxValue,tries);
	}

	let returnVal = Math.floor(lUserInput);
	return returnVal;
} //Returns whole number user input, floors if a floating point

function printHelp() {
	console.log(`
Arguments: (${CLI_SHORT_HELP} || ${CLI_LONG_HELP}), \
(${CLI_SHORT_PER_ROLL} || ${CLI_LONG_PER_ROLL}), \
(${CLI_SHORT_PRINT_SUM} || ${CLI_LONG_PRINT_SUM}), \
XdNpMsM:P:S [...]
${CLI_SHORT_HELP} ${CLI_LONG_HELP}): Display XdNpMsM:P:S notation rules, CLI options
${CLI_SHORT_PRINT_SUM} ${CLI_LONG_PRINT_SUM}: Show sum value of dice rolled, default behavior
${CLI_SHORT_PER_ROLL} ${CLI_LONG_PER_ROLL}: Show value of roll, sum must be specified

Dice notation (XdNpMsM:P:S)
+ X: Numeric, Number of dice, hereafter "dice"
+ d: Human readable notation separating dice and value
+ N: Numeric, Maximum value of die, herafter "sides"
+ p: Human readable notation separating value and per-die modifier
+ M: see below
+ s: Human readable notation separating value and sum modifier
+ M: Numeric, Modifier to add to results, hereafter "mod"
+ P: Show per-roll value, precludes sum unless specified. Any non-zero
+ S: Show sum value, default. Only used if P is also used. Any non-zero
+ :  Human readable notation separating values. Can be used in place of other separators, if you're feeling dangerous
`);
}
