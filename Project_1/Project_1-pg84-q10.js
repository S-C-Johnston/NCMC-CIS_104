#!/usr/bin/env node
/**
 *	@Author: Stewart Johnston <johnstons1@student.ncmich.edu>
 *	@Version: 1.0 | 1.0 declared feature complete 2016-09-26:H:15:34
 *	@Summary: Project One, River Falls Construction Company customer lot configuration | Created 2016-09-26
 *	@Todo:
 */

"use strict";
const PROMPT = require('readline-sync');

let lotNumber, numBedrooms, numBathrooms, garageCapacity, totalLotPrice;
const PRICE_LOT = 50000, PRICE_BEDROOM = 17000, PRICE_BATHROOM = 12500, PRICE_GARAGE_CAR_CAPACITY = 6000;

function main() {
	printWelcome();
	setLotNumber();
	setNumBedrooms();
	setNumBathrooms();
	setGarageCapacity();
	setTotalLotPrice();
	configurationReview();
	setTimeout(printGoodbye, 30000);
}

main();

function printWelcome() {
	console.log(`Welcome to River Falls pre-construction lot configuration.`);
	console.log(`\nPrices for this subdivision start at \$${PRICE_LOT}.`);
}

function setLotNumber() {
	lotNumber = Number(PROMPT.question(`\nPlease enter your lot number: `));
	console.log(`\n\nLoading River Falls lot ${lotNumber} ... `);
}

function setNumBedrooms() {
	console.log(`\nThe price per bedroom is \$${PRICE_BEDROOM}`);
	numBedrooms = Number(PROMPT.question(`\nPlease enter the number of bedrooms desired: `));
	console.log(`\nThe number of bedrooms desired is ${numBedrooms}`);
}

function setNumBathrooms() {
	console.log(`\nThe price per bedroom is \$${PRICE_BATHROOM}`);
	numBathrooms = Number(PROMPT.question(`\nPlease enter the number of bathrooms desired: `));
	console.log(`\nThe number of bathrooms desired is ${numBathrooms}`); 
}

function setGarageCapacity() {
	console.log(`\nThe price per car the garage can hold is \$${PRICE_GARAGE_CAR_CAPACITY}`);
	garageCapacity = Number(PROMPT.question(`\nPlease enter the desired capacity of cars for the garage: `));
	console.log(`\nThe desired garage capacity for cars is ${garageCapacity}`);
}

function setTotalLotPrice() {
	console.log(`\nCalculating total lot price.`);
	totalLotPrice =  Number(PRICE_LOT + (PRICE_BEDROOM * numBedrooms) + (PRICE_BATHROOM * numBathrooms) + (PRICE_GARAGE_CAR_CAPACITY * garageCapacity));
}

function configurationReview() {
	console.log(`\nThe current lot configuration for ${lotNumber} is listed below:`);
	console.log(`\nThe total price of the lot is ${totalLotPrice}`);
	console.log(`\nThe number of bedrooms desired is ${numBedrooms} at ${PRICE_BEDROOM} for each.`);
	console.log(`\nThe number of bathrooms desired is ${numBathrooms} at ${PRICE_BATHROOM} for each.`);
	console.log(`\nThe desired garage capacity in cars is ${garageCapacity} at ${PRICE_GARAGE_CAR_CAPACITY} for each.`);
	console.log(`\n\nThis tool will wait 30 seconds for review, and exit.`);
	//Sleep in distpatcher with setTimeout();
}

function printGoodbye() {
	console.log(`\n\nThank you for choosing River Falls Construction Company!`);
}
