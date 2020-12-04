/**
 


*/
const { parseByRegexPerLine } = require("../utils");

const input_parser = (content) => ({ min: 000000, max: 999999 });

const _digits = new Array(6).fill(0);

const getDigits = (num) => {
  return _digits
    .map((c, i) => Math.floor((num % Math.pow(10, i + 1)) / Math.pow(10, i)))
    .reverse();
};
function solution1(input) {
  let counter = 0;
  //inrange
  for (let num = input.min; num <= input.max; num++) {
    let digits = getDigits(num);
    let inci = true;
    let same = false;
    //Never decrease
    for (let y = 1; y < digits.length; y++) {
      if (digits[y] < digits[y - 1]) {
        inci = false;
        break;
      }
      if (digits[y] === digits[y - 1]) same = true;
    }
    if (inci && same) counter++;
  }
  return counter;
}

function solution2(input) {
  let counter = 0;
  //inrange
  for (let num = input.min; num <= input.max; num++) {
    let digits = getDigits(num);
    let inci = true;
    let same = false;
    let inpair = true;
    //Never decrease
    for (let y = 1; y < digits.length; y++) {
      if (digits[y] < digits[y - 1]) {
        inci = false;
        break;
      }
    }
    if (!inci) continue;
    for (let y = 0; y < digits.length; y++) {
      let dcount = 1;
      if (digits[y] === digits[y + 1]) {
        dcount++;
        y++;
      }
      if (dcount > 1) {
        same = true;
      }
      if (dcount % 2 === 1 && dcount !== 1) {
        inpair = false;
        break;
      }
    }
    if (inci && same && inpair) counter++;
  }
  return counter;
}

function solution(input) {
  // console.log(input);
  //return { part1: null, part2: null };
  return { part1: solution1(input), part2: solution2(input) };
}

module.exports = { input_parser, solution };

/***
 --- Day 4: Secure Container ---
You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.

However, they do remember a few key facts about the password:

It is a six-digit number.
The value is within the range given in your puzzle input.
Two adjacent digits are the same (like 22 in 122345).
Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
Other than the range rule, the following are true:

111111 meets these criteria (double 11, never decreases).
223450 does not meet these criteria (decreasing pair of digits 50).
123789 does not meet these criteria (no double).
How many different passwords within the range given in your puzzle input meet these criteria?

Your puzzle answer was 1330.

The first half of this puzzle is complete! It provides one gold star: *

--- Part Two ---
An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits.

Given this additional criterion, but still ignoring the range rule, the following are now true:

112233 meets these criteria because the digits never decrease and all repeated digits are exactly two digits long.
123444 no longer meets the criteria (the repeated 44 is part of a larger group of 444).
111122 meets the criteria (even though 1 is repeated more than twice, it still contains a double 22).
How many different passwords within the range given in your puzzle input meet all of the criteria?
 */
