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

//Master record constant
//Master record backup constant
//Master record format indexes
//ID
//First name
//Last name
//Transaction sum to date
//Times coupon has been triggered

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
