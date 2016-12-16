#!/usr/bin/env node
// jshint esversion: 6
/**
 * @author: Stewart Johnston <johnstons1@student.ncmich.edu>
 * @summary: DIE ROLLA, a dice roller | Created 2016-12-16
 * @version: 2016.12.16.01
 * @todo:
 */

"use strict";
const PROMPT = require('readline-sync');

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

const RGX_DIE_STRING_SPLIT = /[dps:]/, //Legal splits for manual input
      RGX_ENG_NOUN_30 = /\b[a-zA-Z0-9]{1,30}\B/,
      RGX_ENG_NOUN = RGX_ENG_NOUN_30;

const MENU_CANCEL_VALUE = 0;

function main() {
}

main();

function rollDiceAndPrint(lDiceArray) {
	let dice = lDiceArray[DIE_IDX_DICE];
	let sides = lDiceArray[DIE_IDX_SIDES];
	let perRollModifier = lDiceArray[DIE_IDX_P_MOD];
	let sumModifier = lDiceArray[DIE_IDX_S_MOD];
	let doPrintPerRoll = lDiceArray[DIE_IDX_P_PRINT];
	let doPrintSumValue = lDiceArray[DIE_IDX_S_PRINT];

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
		if (0 !== doPrintSumValue) {
			let sliceStart = (RES_IDX_SUM + 1);
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
