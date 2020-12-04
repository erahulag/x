/**To try to debug the problem, they have created a list (your puzzle input) of passwords (according to the corrupted database) and the corporate policy when that password was set.

For example, suppose you have the following list:

1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
Each line gives the password policy and then the password. The password policy indicates the lowest and highest number of times a given letter must appear for the password to be valid. For example, 1-3 a means that the password must contain a at least 1 time and at most 3 times.

In the above example, 2 passwords are valid. The middle password, cdefg, is not; it contains no instances of b, but needs at least 1. The first and third passwords are valid: they contain one a or nine c, both within the limits of their respective policies.

How many passwords are valid according to their policies?
https://adventofcode.com/2020/day/2/input
 */
const { parseByRegEx } = require("../utils");

/**
 *
 * @typedef {Object} Input
 * @property {number} min
 * @property {number} max
 * @property {string} c
 * @property {string} pw
 */
/**
 * Parse input
 * @param {string} content
 * @returns {Input[]}
 */
const input_parser = (content) =>
  parseByRegEx(
    content,
    /(\d+)-(\d+)\s(\w):\s(.*)/g,
    [null, "min", "max", "c", "pw"],
    { min: (v) => parseInt(v, 10), max: (v) => parseInt(v, 10) }
  );

/**
 * Solution for day2 problem
 * @param {Input[]} input
 * @returns {number|string}
 */

function solution1(input) {
  const chars = input.map((i) => {
    let l = [...i.pw].filter((pc) => pc === i.c).length;
    return l >= i.min && l <= i.max;
  });
  return chars.filter((c) => c).length;
}

function solution2(input) {
  return input.reduce((ac, i) => {
    let a =
      (i.c === i.pw[-1 + i.min] && i.c !== i.pw[-1 + i.max]) ||
      (i.c !== i.pw[-1 + i.min] && i.c === i.pw[-1 + i.max]);

    return a ? ac + 1 : ac;
  }, 0);
}

function solution(input) {
  // console.log(input);
  return { part1: solution1(input), part2: solution2(input) };
}

module.exports = { input_parser, solution };
