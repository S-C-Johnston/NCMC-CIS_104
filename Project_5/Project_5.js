#!/usr/bin/env node
// jshint esversion: 6
/**
 * @author: Stewart Johnston <johnstons1@student.ncmich.edu>
 * @summary: MidArmeric Bus Company ticket price calculator | Created 2016-12-14
 * @version: 2016.12.14.01
 * @todo:
 */

"use strict";
const PROMPT = require('readline-sync');
const CONTINUE_YES = 1,
      CONTINUE_NO = 0;

const ZONE_PASSENGER_PRICES = [ //Rows are zones crossed, columns are passengers
	[7.50, 14.00, 20.00, 25.00],
	[10.00, 18.50, 21.00, 27.50],
	[12.00, 22.00, 32.00, 36.00],
	[12.75, 23.00, 33.00, 37.00],
]; //I know it isn't REALLY constant, but it can't be overwritten, only added to

function main() {
	let doContinue = CONTINUE_YES;
	printGreeting();
	while (CONTINUE_YES === doContinue) {
		let userInput = inputMainMenu();
		interpMMenuInput(userInput);
		doContinue = inputDoContinue();
	}
	printGoodbye();
	return main();
}

main();

function inputDoContinue() {
	console.log(`\nDo you want to continue? [${CONTINUE_YES} = yes], [${CONTINUE_NO} = no]`);
	let lUserInput = Math.floor(inputNumericInRange(CONTINUE_NO,CONTINUE_YES));

	return lUserInput;
}

function inputMainMenu() {
	let maxZoneOption = ZONE_PASSENGER_PRICES.length;
	console.log(`\nPlease enter the number of travel zones you intend to cross.`);
	let lZonesCrossed = Math.floor(inputNumericInRange(0,maxZoneOption));
	console.log(`\nYou've selected ${lZonesCrossed} travel zones to cross`);

	let maxPassengerOption = ZONE_PASSENGER_PRICES[lZonesCrossed].length;
	const REAL_NUM_MIN = 1;
	console.log(`\nPlease enter the number of passengers travelling on this trip.`);
	let lPassengerCount = Math.floor(
		inputNumericInRange(REAL_NUM_MIN,maxPassengerOption));
	console.log(`\nYou've selected ${lPassengerCount} passengers`);
	lPassengerCount--;
	// ^ Subtracting one to account for array 0 index offset

	return [lZonesCrossed, lPassengerCount];
}

function interpMMenuInput(zoneAndPassengerCount) {
	let lZonesCrossed = zoneAndPassengerCount.shift(),
	    lPassengerCount = zoneAndPassengerCount.shift();

	let lTicketPrice = ZONE_PASSENGER_PRICES[lZonesCrossed][lPassengerCount];

	console.log(`\nThe price of the tickets for this trip is: $ ${lTicketPrice}`);

	return lTicketPrice;
}

function inputNumericInRange(minValue, maxValue, lInputTries) {
	const MAX_INPUT_TRIES = 3;
	lInputTries = (undefined !== lInputTries) ? lInputTries + 1 : 0 ;
	if (MAX_INPUT_TRIES < lInputTries) {
		console.log(`\nThere have been too many bad tries. Exiting.`);
		process.exit();
	}

	let lUserInput = Number(
		PROMPT.question(`\nPlease enter a value between ${minValue} and ${maxValue}`));

	if ((true === isNaN(lUserInput)) ||
	lUserInput < minValue ||
	maxValue < lUserInput) {
		console.log(`\nThe value you entered either wasn't a number or was outside of the accepted range. Please try again.`);
		let lTriesRemaining = (MAX_INPUT_TRIES - lInputTries);
		console.log(`\nYou have ${lTriesRemaining} tries remaining.`);
		return inputNumericInRange(minValue, maxValue, lInputTries);
	}

	return lUserInput;
}

function printGreeting() {
	console.log(`\nWelcome to the MidAmeric Bus Company ticket pricing terminal.`);
}

function printGoodbye() {
	console.log(`\nThanks for choosing MidAmerica Bus Company!`);
}
