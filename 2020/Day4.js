const { parseByRegexPerLine, readLines } = require("../utils");
/**
 byr (Birth Year)
iyr (Issue Year)
eyr (Expiration Year)
hgt (Height)
hcl (Hair Color)
ecl (Eye Color)
pid (Passport ID)
cid (Country ID)
 */
const input_parser = (content) =>
  parseByRegexPerLine(
    readLines(content)
      .map((t) => (/^\s*$/.test(t) ? "|" : t))
      .join(" ")
      .split("|")
      .join("\n"),
    /^(.*)$/gm,
    [null, "passport"],
    {
      passport: (tr) =>
        tr
          .split(" ")
          .map((a) => a.split(":"))
          .filter((a) => !!a[0])
          .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
    }
  ).map((a) => a[0].passport);

const Checker = new Set([
  "byr", // (Birth Year)
  "iyr", // (Issue Year)
  "eyr", // (Expiration Year)
  "hgt", //: false, // (Height)
  "hcl", //: false, // (Hair Color)
  "ecl", //: false, // (Eye Color)
  "pid", //: false, // (Passport ID)
]);

/**
 * byr (Birth Year) - four digits; at least 1920 and at most 2002.
iyr (Issue Year) - four digits; at least 2010 and at most 2020.
eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
hgt (Height) - a number followed by either cm or in:
If cm, the number must be at least 150 and at most 193.
If in, the number must be at least 59 and at most 76.
hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
pid (Passport ID) - a nine-digit number, including leading zeroes.
cid (Country ID) - ignored, missing or not.
 */
const ValidationRules = {
  byr: (_y) => {
    const y = parseInt(_y, 10);
    return y > 1919 && y < 2003;
  },
  iyr: (_y) => {
    const y = parseInt(_y, 10);
    return y > 2009 && y < 2021;
  },
  eyr: (_y) => {
    const y = parseInt(_y, 10);
    return y > 2019 && y < 2031;
  },
  hgt: (_y) => {
    const y = parseInt(_y, 10);
    return (
      (/^\d+cm$/.test(_y) && y > 149 && y < 194) ||
      (/^\d+in$/.test(_y) && y > 58 && y < 77)
    );
  },
  hcl: (y) => /^#[0-9a-f]{6}$/.test(y),
  ecl: (y) => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(y),
  pid: (y) => /^[0-9]{9}$/.test(y),
};
const Rules = Object.keys(ValidationRules);

function solution1(input) {
  return input.filter((p) => {
    const ch = new Set(Checker);
    Object.keys(p).forEach((k) => ch.delete(k));
    return !ch.size;
  }).length;
}

function solution2(input) {
  return input.filter((p) => {
    const ret = true;
    for (let r of Rules) {
      if (!p[r] || !ValidationRules[r](p[r])) return false;
    }
    return true;
  }).length;
}

function solution(input) {
  console.log(input);
  // return { part1: 1, part2: 2 };
  // return { part1: solution1(input), part2: 2 };
  return { part1: solution1(input), part2: solution2(input) };
}

module.exports = { input_parser, solution };
