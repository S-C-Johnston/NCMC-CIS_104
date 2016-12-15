#!/usr/bin/env node
// jshint esversion: 6
/**
 * @author: Stewart Johnston <johnstons1@student.ncmich.edu>
 * @summary: Curl Up and Dye record-keeper | Created 2016-12-14
 * @version: 2016.12.14.01
 * @todo:
 */

"use strict";
const PROMPT = require('readline-sync');
const IO = require('fs');

const RGX_WIN_OR_NIX_NEWLINE = /\r?\n/,
      RGX_ENG_NOUN_30 = /^[a-zA-Z0-9]{1,30}$/,
      RGX_FIELD_SEPARATOR = /,/;

const MASTER_RECORD = "Master.csv",//Master record constant
      BACKUP_EXT = ".bak";//Master record backup constant
//Master record format indexes
const MSTR_IDX_IDNUM = 0,//ID
      MSTR_IDX_NAME_FIRST = 1,//First name
      MSTR_IDX_NAME_LAST = 2,//Last name
      MSTR_IDX_SUM_SPENT = 3,//Transaction sum to date
      MSTR_IDX_COUPON_CT = 4;//Times coupon has been triggered
const COUPON_INCREMENT = 750;

const WEEKEND_DATE = (function() {
	let date = new Date();
	let today = date.getDay();
	let diff = (6 - today);
	let targetMonthDay = (date.getDate() + diff);
	date.setDate(targetMonthDay);
	return date.toISOString().slice(0,10);
})();
const TRANSACTION_RECORD = (`${WEEKEND_DATE}-Transactions.csv`);//(Weekly) Transaction record constant
//Transaction record format indexes
const TRNS_IDX_IDNUM = MSTR_IDX_IDNUM,
      TRNS_IDX_TRANSACTION_SUM = 1,
      TRNS_IDX_MEMO = 2;

function main() {
}

main();

function tabulateFileData(lFileHandle) {
	let fileContents = IO.readFileSync(`${lFileHandle}`, 'utf8');
	let fileLines = fileContents.toString().split(RGX_WIN_OR_NIX_NEWLINE);
	let dataRecords = [];
	for (let item of fileLines) {
		dataRecords.push(item.toString().split(RGX_FIELD_SEPARATOR));
	}
	return dataRecords;
}//Read file in and split into 2d array, return that array as a result

function sortTableByID(workingTable) {
	let setSize = workingTable.length;
	for (let i = 1; i < setSize; i++) {
		let tmp = workingTable[i];
		let j = (i - 1);
		while (j > 0 && 
		workingTable[j][TRNS_IDX_IDNUM] >
		tmp[TRNS_IDX_IDNUM]) {
			workingTable[(j + 1)] = workingTable[j];
			j--;
		}
		workingTable[(j + 1)] = tmp;
	}

	return workingTable;
}//Sort record arrays by ID number

function updateMasterRecords(masterRecords, transactionRecords) {
	for (let transRecord of transactionRecords) {
		let updateSuccess = false;
		for (let masterRecord of masterRecords) {
			let updatedRecord = 
			updateIndividualMasterRecord(masterRecord,transRecord);	

			if (updatedRecord !== masterRecord) {
				masterRecord = updatedRecord;
				updateSuccess = true;
			}

			masterRecord = checkCouponStatus(masterRecord);
		}
		if (false === updateSuccess) {
			let lFailedIndex = transactionRecords.indexOf(transRecord);
			logUpdateFailure(lFailedIndex,transRecord);
		}
	}
	return masterRecords;
}//Match transaction record to master record, update cumulative total to
//master record. Add current week's spent (transaction record) to master record
//spent to date. 
//Output: updated master record, error file when any transaction record doesn't
//have a matching master record ID.

function updateIndividualMasterRecord(lMasterRecord, lTransRecord) {
	if (lMasterRecord[MSTR_IDX_IDNUM] ===
			lTransRecord[TRNS_IDX_IDNUM]) {
		lMasterRecord[MSTR_IDX_SUM_SPENT] +=
			lTransRecord[TRNS_IDX_TRANSACTION_SUM];
	}
	return lMasterRecord;
}

function checkCouponStatus(lMasterRecord) {
	let toCoupon = (lMasterRecord[MSTR_IDX_SUM_SPENT] -
			(COUPON_INCREMENT *
			 lMasterRecord[MSTR_IDX_COUPON_CT]));
	if (COUPON_INCREMENT <= toCoupon) {
		let newCoupons = Math.floor(toCoupon / COUPON_INCREMENT);
		lMasterRecord[MSTR_IDX_COUPON_CT] += newCoupons;

		console.log(`\nClient is entitled to ${newCoupons} coupons!`);
		printCoupons();
	}
	return lMasterRecord;
}//Each time $750 is exceeded, output a coupon for free haircut

function printCoupons() {
}

function logUpdateFailure(recordIndex, recordData) {
} //Write error file	

//Allow updating transaction record
