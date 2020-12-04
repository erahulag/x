const { readContent, inputPath } = require("../utils");

const days = {
  day1: require("./Day1"),
  day2: require("./Day2"),
  day3: require("./Day3"),
  day4: require("./Day4"),
};

const inputs = (content) => (day) => days[`day${day}`].input_parser(content);

const solve = async (day) => {
  const content = await readContent(inputPath(day));
  const input = inputs(content)(day);
  const answer = days[`day${day}`].solution(input);
  console.log(answer);
};

const solver = (argv) => {
  const prob = parseInt(argv[2], 10);
  if (Number.isInteger(prob)) {
    solve(prob);
  } else {
    console.log("Which problem do we want to solve?");
  }
};

solver(process.argv);
