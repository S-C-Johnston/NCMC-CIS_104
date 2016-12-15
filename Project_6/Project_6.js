#!/usr/bin/env node
// jshint esversion: 6
/**
 * @author: Stewart Johnston <johnstons1@student.ncmich.edu>
 * @summary: Curl Up and Dye record-keeper | Created 2016-12-14
 * @version: 2016.12.14.06
 * @todo:
 */

"use strict";
const PROMPT = require('readline-sync');
const IO = require('fs');
const TEXT_ENCODING = 'utf8';

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
      MSTR_IDX_COUPON_CT = 4,//Times coupon has been triggered
      MSTR_IDX_COUPONS_USED = 5,
      MSTR_IDX_B_UPDATED = 6;
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
      TRNS_IDX_MEMO = 2,
      TRNS_IDX_COUPONS_USED = 3;

const ERROR_LOG = "Master_update_failures.log";

function main() {
	let master = tabulateInFileData(MASTER_RECORD);
	createWeekStampedBackupFile(MASTER_RECORD, master);
	master = sortTableByID(master);
	let transactions = tabulateInFileData(TRANSACTION_RECORD);
	transactions = sortTableByID(transactions);
	updateMasterRecords(master,transactions);
	writeEmptyFile(MASTER_RECORD);
	appendTableToFileOnDisk(MASTER_RECORD,master);
}

main();

function createWeekStampedBackupFile(lFileHandle, lTableData) {
	let weekStampedFileName = (`${WEEKEND_DATE}${lFileHandle}${BACKUP_EXT}`);
	writeEmptyFile(weekStampedFileName);
	appendTableToFileOnDisk(weekStampedFileName,lTableData);
}

function writeEmptyFile(lFileHandle) {
	IO.writeFileSync(`${lFileHandle}`, "", `${TEXT_ENCODING}`);
}

function appendTableToFileOnDisk(lFileHandle, lTableData) {
	for (let i = 0; i < lTableData.length; i++) {
		const COLUMNS = lTableData[i].length;
		for (let j = 0; j < COLUMNS; j++) {
			if (j > 0) {
				IO.appendFileSync(`${lFileHandle}`,
				`,${lTableData[i][j]}`, `${TEXT_ENCODING}`);
			}
			else {
				IO.appendFileSync(`${lFileHandle}`,
				`${lTableData[i][j]}`, `${TEXT_ENCODING}`);
			}
		}
		IO.appendFileSync(`${lFileHandle}`, "\n", `${TEXT_ENCODING}`);
	}
}

function tabulateInFileData(lFileHandle) {
	let fileContents = IO.readFileSync(`${lFileHandle}`, `${TEXT_ENCODING}`);
	let fileLines = fileContents.toString().split(RGX_WIN_OR_NIX_NEWLINE);
	let dataRecords = [];
	for (let i = 0; i < fileLines.length; i++) {
	//console.log(fileLines[i]);
		dataRecords.push(fileLines[i].toString().split(RGX_FIELD_SEPARATOR));
	}
	//console.log(dataRecords);
	dataRecords.pop();
	// ^ For some inane reason, without this there is an extra dangling
	// elemnt which is null and it screws up all the math. WTF.
	//console.log(dataRecords);
	dataRecords = numericizeTableRecords(dataRecords);
	return dataRecords;
}//Read file in and split into 2d array, return that array as a result

function numericizeTableRecords(lWorkingTable) {
	for (let record of lWorkingTable) {
		for (let item of record) {
			//let bNotANumber = isNaN(item);
			//console.log(`bNotANumber: ${bNotANumber}, value: ${item}`);
			item = (false === isNaN(item)) ? Number(item) : item ;
		}
	}
	return lWorkingTable;
}

function sortTableByID(workingTable) {
	let setSize = workingTable.length;
	for (let i = 1; i < setSize; i++) {
		let tmp = workingTable[i];
		let j = (i - 1);
		//console.log(`i: ${i}, j: ${j}, tmp: ${tmp}`);
		while (j >= 0 && 
		Number(workingTable[j][TRNS_IDX_IDNUM]) >
		Number(tmp[TRNS_IDX_IDNUM])) {
			//console.log(`j: ${j}, j_ID: ${Number(workingTable[j][TRNS_IDX_IDNUM])}, tmp_ID:${Number(tmp[TRNS_IDX_IDNUM])}`);
			workingTable[(j + 1)] = workingTable[j];
			j--;
		}
		workingTable[(j + 1)] = tmp;
	}
	//console.log(workingTable);
	return workingTable;
}//Sort record arrays by ID number

function updateMasterRecords(masterRecords, transactionRecords) {
	for (let transRecord of transactionRecords) {
		//console.log(`\ttransRecord: ${transRecord}`);
		let updateSuccess = false;
		for (let masterRecord of masterRecords) {
			//console.log(`masterRecord: ${masterRecord}`);
			masterRecord = updateSingleMasterRecord(masterRecord,transRecord);	

			if (true === masterRecord[MSTR_IDX_B_UPDATED]) {
				updateSuccess = true;
				masterRecord[MSTR_IDX_B_UPDATED] = false;
				//console.log(`updateSuccess: ${updateSuccess}`);
				break;
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

function updateSingleMasterRecord(lMasterRecord, lTransRecord) {
	//console.log(`lMasterRecord: ${lMasterRecord}`);
	//console.log(`lTransRecord: ${lTransRecord}`);
	if (lMasterRecord[MSTR_IDX_IDNUM] ===
	    lTransRecord[TRNS_IDX_IDNUM]) {
		lMasterRecord[MSTR_IDX_SUM_SPENT] =
		(Number(lMasterRecord[MSTR_IDX_SUM_SPENT]) +
		Number(lTransRecord[TRNS_IDX_TRANSACTION_SUM]));
		//WTF, javascript, y u no keep numbers as numbers
		lMasterRecord[MSTR_IDX_COUPONS_USED] =
		(Number(lMasterRecord[MSTR_IDX_COUPONS_USED]) +
		Number(lTransRecord[TRNS_IDX_COUPONS_USED]));

		lMasterRecord[MSTR_IDX_B_UPDATED] = true;
	}
	//console.log(`lMasterRecord: ${lMasterRecord}`);
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
		printCoupons(lMasterRecord);
	}
	return lMasterRecord;
}//Each time $750 is exceeded, output a coupon for free haircut

function printCoupons(clientData) {
	let clientName = (`${clientData[MSTR_IDX_NAME_FIRST]} ${clientData[MSTR_IDX_NAME_LAST]}`);
	let clientID = clientData[MSTR_IDX_IDNUM];
	let lFileHandle = (`${clientID}_Coupon.txt`);
	writeEmptyFile(lFileHandle);
	IO.appendFileSync(`${lFileHandle}`, 
`Congratulations ${clientName}, you've earned a coupon for one free haircut for
your loyalty. Your ID is: ${clientID}, and anyone may use this coupon under
your ID. Thank you for choosing Curl Up and Dye!`, 
	`${TEXT_ENCODING}`);
	console.log(`\nCoupon written to disk for client, please print coupons as appropriate.`);
}

function logUpdateFailure(recordIndex, recordData) {
	IO.appendFileSync(`${ERROR_LOG}`,
	`ERROR! Record # ${recordIndex} did not have a matching Master ID. The transaction record is: ${recordData}\n`,
	`${TEXT_ENCODING}`);
} //Write error file	
