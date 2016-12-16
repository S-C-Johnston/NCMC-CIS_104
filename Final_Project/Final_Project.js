#!/usr/bin/env node
// jshint esversion: 6
/**
 * @author: Stewart Johnston <johnstons1@student.ncmich.edu>
 * @summary: DIE ROLLA, a dice roller | Created 2016-12-16
 * @version: 2016.12.16.01
 * @todo:
 */

"use strict";
const PROMPT = require('readline-sync');

const SET_IDX_NAME = 0, //Name of set
      SET_IDX_NUM_ROLLS = 1, //Number of rolls in the set
      SET_IDX_P_PRINT = 2, //Per-roll value print boolean
      SET_IDX_S_PRINT = 3, //Sum value print boolean
      SET_IDX_DIE_ROLLS = 4; //Where the list of die rolls lives

const DIE_IDX_DICE = 0, //Number of dice
      DIE_IDX_SIDES = 1, //Max face value of those dice
      DIE_IDX_P_MOD = 2, //Per-roll modifier
      DIE_IDX_S_MOD = 3, //Sum modifier
      DIE_IDX_P_PRINT = 4, //Print values per roll
      DIE_IDX_S_PRINT = 5; //Print values for sum

const D4 = 4, //Pre-loaded dice face values
      D6 = 6,
      D8 = 8,
      D10 = 10,
      D12 = 12,
      D20 = 20;

const RGX_DIE_STRING_SPLIT = /[dps:]/, //Legal splits for manual input
      RGX_ENG_NOUN_30 = /\<[a-zA-Z0-9]{1,30}\>/,
      RGX_ENG_NOUN = RGX_ENG_NOUN_30;

const MENU_CANCEL_VALUE = 0;

function main() {
}

main();

