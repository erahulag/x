const fs = require("fs");

const readContent = async (path) => {
  return new Promise((r, e) =>
    fs.readFile(path, "utf8", function (err, contents) {
      if (err) {
        e({ path, error: err });
      }
      r(contents);
    })
  );
};

const readLines = (content) => {
  return content.split("\n");
};

const inputPath = (day) => `./input/day${day}`;

/**
 *
 * @param {string} str Content to be parsed
 * @param {RegEx} regex
 * @param {string[]} var_names
 * @param {{[key:string]:string}} parser
 */
const parseByRegexPerLine = (str, regex, var_names, parser) => {
  let lines = readLines(str);
  return lines.map((l) => parseByRegEx(l, regex, var_names, parser));
};

/**
 *
 * @param {string} str content to parse
 * @param {typeof RegEx} regex Regular expression adds groups of parsed data
 * @param {string[]} var_names Nullable string name for the object to return
 * @param {{[key:string]:function}} parser Parse string of object using this function
 */
const parseByRegEx = (str, regex = /(.*)/g, var_names = [], parser = {}) => {
  let m;
  const output = [];
  while ((m = regex.exec(str)) !== null) {
    let obj = {};
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
      if (var_names[groupIndex]) {
        const k = var_names[groupIndex];
        obj[k] = parser[k] ? parser[k](match) : match;
      }
    });
    output.push(obj);
  }
  return output;
};

const parseIntegerList = (content) =>
  readLines(content).map((l) => parseInt(l, 10));

module.exports = {
  inputPath,
  readContent,
  readLines,
  parseByRegEx,
  parseByRegexPerLine,
  parseIntegerList,
};
