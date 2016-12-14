#!/usr/bin/env node
// jshint esversion: 6
/**
 * @author: Stewart Johnston <johnstons1@student.ncmich.edu>
 * @summary: Hollywood Movie Rating Guide rating program | Created 2016-12-13
 * @version: 1.0 | 1.0 Deemed feature complete 2016-12-13
 * @todo:
 */


"use strict";
const PROMPT = require('readline-sync');

const MIN_STARS = 0,
      MAX_STARS = 5;
const MAX_TRIES = 3;
const CONTINUE_YES = 1,
      CONTINUE_NO = 0;
let continueResponse;

const IDX_TITLE = 0,
      IDX_RATING_SUM = 1,
      IDX_NUM_RATINGS = 2,
      IDX_RATINGS_LOG = 3;
let movies = [
	["Hello Kitty 2: Electric Boogaloo"],
	["Battles in SPAAACE VII: Edgy Jerk Progeny"],
	["Doctor Peculiar Circumstances"],
	["Legally Safe 4: Revenge of the DMCA"],
	["Swiss-army-knife-man and the Filed Off Serial Numbers"],
];

function main() {
	printGreeting();
	let chosenMovieIndex = mainMenu();
	movieOptionsMenu(chosenMovieIndex);
	printGoodbye();
	return main();
}

main();

function movieOptionsMenu(lMovieIndex) {
	let lChosenMovieTitle = movies[lMovieIndex][IDX_TITLE];
	let lMaxOption = printMovieOptionsMenu(lChosenMovieTitle);
	let lUserChoice = inputNumericInRange(0,lMaxOption);
	let movieRating;

	switch (lUserChoice) {
		case 0: //Exit This Menu
			return false;
		case 1: //Rate chosen film
			movieRating = inputMovieRating(lChosenMovieTitle);
			updateMovieRatingSum(lMovieIndex,movieRating);
			updateMovieNumRatings(lMovieIndex);
			updateMovieRatingLog(lMovieIndex,movieRating);
			break;
		case 2: //Print Average rating for film
			let lRatingSum = movies[lMovieIndex][IDX_RATING_SUM];
			let lNumRatings = movies[lMovieIndex][IDX_NUM_RATINGS];
			return calcAvg(lRatingSum,lNumRatings,true);
		default:
			console.log(`\nIf you're seeing this, something went wrong.`);
			return false;
	}

	return movieRating;
}

function updateMovieRatingLog(lIndex, lMovieRating) {
	if (undefined !== movies[lIndex][IDX_RATINGS_LOG]) {
		movies[lIndex][IDX_RATINGS_LOG].push(lMovieRating);
	}
	else {
		movies[lIndex][IDX_RATINGS_LOG] = [lMovieRating];
	}
}

function updateMovieNumRatings(lIndex) {
	movies[lIndex][IDX_NUM_RATINGS] =
		(undefined === movies[lIndex][IDX_NUM_RATINGS]) ?
		1 :
		movies[lIndex][IDX_NUM_RATINGS] + 1;
	return movies[lIndex][IDX_NUM_RATINGS];
}

function updateMovieRatingSum(lIndex, lMovieRating) {
	movies[lIndex][IDX_RATING_SUM] =
		(undefined === movies[lIndex][IDX_RATING_SUM]) ?
		lMovieRating :
		movies[lIndex][IDX_RATING_SUM] + lMovieRating;
	return movies[lIndex][IDX_RATING_SUM];
}

function printMovieOptionsMenu(lMovieTitle) { //Returns the maximum menu option
	console.log(`\nYou've chosen ${lMovieTitle}`);
	let lMenuOptions = [
		"0 = Leave This Menu",
		"1 = Rate This Film",
		"2 = View Mean Average Rating of Film",
		];

	for (let i of lMenuOptions) {
		console.log(`\nOption ${i}`);
	}

	return (lMenuOptions.length - 1);
}

function mainMenu() {
	let maxOption = printMainMenu();
	return inputMainMenuChoice(maxOption);
}

function printMainMenu() { //Returns maximum option number
	for (let i = 0; i < movies.length; i++) {
		let lMovieTitle = movies[i][IDX_TITLE];
		console.log(`\n[ ${i} ]: ${lMovieTitle}`);
	}
	return (movies.length - 1);
}

function inputMainMenuChoice(lMaxOption) { //Returns numeric value corrosponding to a title
	console.log(`\nYou will have a choice of any of the above to rate.`);
	let lUserChoice = inputNumericInRange(0, lMaxOption);

	return lUserChoice;
}

function calcAvg(setSum, numSetParts, doPrint) {
	let averageValue = (setSum / numSetParts); //Mean average
	if (true === doPrint) {
		if (false === isNaN(averageValue)) {
			console.log(`\nThe average value is ${averageValue}.`);
		}
		else {
			console.log(`\nThere is not enough data for an average, yet.`);
		}
	}
	return averageValue;
}

function inputMovieRating(movieTitle) { // Returns numeric movie rating
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
