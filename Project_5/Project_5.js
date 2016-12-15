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

const ZONE-PASSENGER_PRICES = [
	[], //This page intentionally left blank. Dumb, but offsets the array for UI purposes
	[7.50, 10.00, 12.00, 12.75],
	[14.00, 18.50, 22.00, 23.00],
	[20.00, 21.00, 32.00, 33.00],
	[25.00, 27.50, 36.00, 37.00],
]; //I know it isn't REALLY constant, but it can't be overwritten, only added to

function main() {
	printGreeting();
	printGoodbye():
}

main();

function printGreeting() {
	console.log(`\nWelcome to the MidAmeric Bus Company ticket pricing terminal.`);
}

function printGoodbye() {
	console.log(`\nThanks for choosing MidAmerica Bus Company!`);
}
