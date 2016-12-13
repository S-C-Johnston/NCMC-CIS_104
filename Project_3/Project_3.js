#!/usr/bin/env node
// jshint esversion: 6
/**
 * @author: Stewart Johnston <johnstons1@student.ncmich.edu>
 * @summary: Hollywood Movie Rating Guide rating program | Created 2016-12-13
 * @version: 1.0.1 | 1.0 deemed feature complete
 * @todo: 
 */


"use strict";
const PROMPT = require('readline-sync');

const MIN_STARS = 0,
      MAX_START = 5;
const MAX_TRIES = 3;
const CONTINUE_YES = 1,
      CONTINUE_NO = 0;
let continueResponse;

function main() {
	printGreeting();

	const MOVIE_TITLE = "Hello Kitty";
	let movieRating;
	let numRatings = 0;
	let ratingsSum = 0;

	setContinueResponse();

	while (CONTINUE_YES === continueResponse) {
		movieRating = inputMovieRating(MOVIE_TITLE);
		numRatings++;
		ratingsSum += movieRating;
		setContinueResponse();
	}

	let avgRating = calcAvg();
	calcAvg(ratingsSum, numRatings, true);

	printGoodbye();
}

main();

function calcAvg(setSum, numSetParts, doPrint) {
	let averageValue = (setSum / numSetParts); //Mean average
	if (true === doPrint) {
		console.log(`\nThe average value is ${averageValue}.`);
	}
	return averageValue;
}

function inputMovieRating(movieTitle) {
	console.log(`\nYou will be asked to rate ${movieTitle} in stars. Higher is better.`);
	let lMovieRating = Number(inputNumericInRange(MIN_STARS,MAX_STARS));
	console.log(`\nYou rated ${movieTitle} at ${lMovieRating} stars.`);

	return lMovieRating;
}

function setContinueResponse() {
	if (undefined !== continueResponse) {
		continueResponse = -1;
		while (continueResponse !== CONTINUE_NO &&
		       continueResponse !== CONTINUE_YES) {
			continueResponse = Number(PROMPT.question(`\nDo you want to continue? [${CONTINUE_NO}=no, ${CONTINUE_YES}=yes]: `));
		}
	}
	else {
		continueResponse = CONTINUE_YES;
	}
}

function printGreeting() {
	console.log(`\nWelcome to the Hollywood Movie Rating Guide rating program.`);
}

function printGoodbye() {
	console.log(`\nThanks for using the Hollywood Movie Rating Guide rating program!`);
}

function inputNumericInRange(MIN, MAX, tries) { //returns numeric value
	tries = (undefined === tries) ? 0 : tries + 1;
	if (tries > MAX_TRIES) {
		console.log(`\nPermitted number of tries exceeded. Program will now exit.`);
		process.exit();
	}

	let lUserInput = Number(PROMPT.question(`\nPlease enter a number between ${MIN} and ${MAX}: `));

	if (isNaN(lUserInput) || MIN > lUserInput || MAX < lUserInput) {
		console.log(`\nError! The value you entered either wasn't a number or wasn't in range. Please try again.`);
		let triesRemaining = (MAX_TRIES - tries);
		console.log(`\nYou have ${triesRemaining} tries remaining.`);
		return inputNumericInRange(MIN, MAX, tries);
	}

	return lUserInput;
}
