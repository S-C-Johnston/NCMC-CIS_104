#!/usr/bin/env node
// jshint esversion: 6
/**
 *
 *
 *
 *
 */

'use strict';
const PROMPT = require('readline-sync');

let playerChoice, computerChoice;
let winner;
const	ROCK = 1,
	PAPER = 2,
	SCISSORS = 3;
const	TIE = 'tie',
	WIN_COMP = 'computer',
	WIN_PLAY = 'player';

function main(){
	let doContinue = true;
	(function mainLoop(doContinue) {

		if (false === doContinue) {
			return;
		}

		setPlayerChoice();
		setComputerChoice();
		setWinner();
		printWinner();

		if (TIE == winner) {
			return mainLoop();
		}

		doContinue = setDoContinue();
		return mainLoop(doContinue);
	})();
}	

main();

function setDoContinue() {
	let userAnswer = PROMPT.question(`\nDo you want to continue? 0 = no, non-zero = yes : `);
	let boolContinue = ((0 == userAnswer) ? Boolean(Number(userAnswer)) : Boolean(userAnswer)); //jshint ignore:line
	return boolContinue;
}

function setPlayerChoice() {
	playerChoice = Math.floor(Number(PROMPT.question(`\nChoose rock(1), paper(2), or scissors(3): `)));
	if (Number.isNaN(playerChoice)) {
		console.log(`\nThe value you used was not valid, please enter again.`);
		return setPlayerChoice();
	}
	else if (ROCK > playerChoice || SCISSORS < playerChoice){
		console.log(`\nThe value you used was not valid, please enter again.`);
		return setPlayerChoice();
	}
}

function setComputerChoice() {
	computerChoice = Math.floor(Math.random() * (SCISSORS - ROCK + 1) + ROCK);
}

function setWinner() {
	if (computerChoice == playerChoice) {
		winner = TIE;
	}
	else if (ROCK == playerChoice && PAPER == computerChoice) {
		winner = WIN_COMP;
	}
	else if (PAPER == playerChoice && SCISSORS == computerChoice) {
		winner = WIN_COMP;
	}
	else if (SCISSORS == playerChoice && ROCK == computerChoice) {
		winner = WIN_COMP;
	}
	else {
		winner = WIN_PLAY;
	}
}

function printWinner() {
	if (TIE == winner) {
		console.log(`\nThere was no winner, it was a tie!`);
	}
	else {
		console.log(`\nThe winner is ${winner}.`);
	}
}
