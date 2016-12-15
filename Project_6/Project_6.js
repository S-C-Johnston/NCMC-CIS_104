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

const MASTER_RECORD = "Master.csv",//Master record constant
      BACKUP_EXT = ".bak";//Master record backup constant
//Master record format indexes
const MSTR_IDX_IDNUM = 0,//ID
      MSTR_IDX_NAME_FIRST = 1,//First name
      MSTR_IDX_NAME_LAST = 2,//Last name
      MSTR_IDX_SUM_SPENT = 3,//Transaction sum to date
      MSTR_IDX_COUPON_CT = 4;//Times coupon has been triggered

//(Weekly) Transaction record constant
//Transaction record format indexes

function main() {
}

main();

//Read file in and split into 2d array, return that array as a result

//Sort record arrays by ID number

//Match transaction record to master record, update cumulative total to
//master record. Add current week's spent (transaction record) to master record
//spent to date. 
//Output: updated master record, error file when any transaction record doesn't
//have a matching master record ID.
//
//Each time $750 is exceeded, output a coupon for free haircut

//Allow updating transaction record
