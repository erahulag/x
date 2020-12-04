/**
The gravity assist was successful, and you're well on your way to the Venus refuelling station. During the rush back on Earth, the fuel management system wasn't completely installed, so that's next on the priority list.

Opening the front panel reveals a jumble of wires. Specifically, two wires are connected to a central port and extend outward on a grid. You trace the path each wire takes as it leaves the central port, one wire per line of text (your puzzle input).

The wires twist and turn, but the two wires occasionally cross paths. To fix the circuit, you need to find the intersection point closest to the central port. Because the wires are on a grid, use the Manhattan distance for this measurement. While the wires do technically cross right at the central port where they both start, this point does not count, nor does a wire count as crossing with itself.

For example, if the first wire's path is R8,U5,L5,D3, then starting from the central port (o), it goes right 8, up 5, left 5, and finally down 3:

...........
...........
...........
....+----+.
....|....|.
....|....|.
....|....|.
.........|.
.o-------+.
...........
Then, if the second wire's path is  R8,U5,L5,D3 U7,R6,D4,L4, it goes up 7, right 6, down 4, and left 4:

...........
.+-----+...
.|.....|...
.|..+--X-+.
.|..|..|.|.
.|.-X--+.|.
.|..|....|.
.|.......|.
.o-------+.
...........
These wires cross at two locations (marked X), but the lower-left one is closer to the central port: its distance is 3 + 3 = 6.

Here are a few more examples:

R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83 = distance 159
R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = distance 135
What is the Manhattan distance from the central port to the closest intersection?


*/
const { parseByRegexPerLine } = require("../utils");

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
  parseByRegexPerLine(content, /([RLUD])(\d+)/g, [null, "dir", "move"], {
    move: (v) => parseInt(v, 10),
  });

class Point {
  constructor(x, y) {
    this.x_ = x;
    this.y_ = y;
  }
  get x() {
    return this.x_;
  }
  get y() {
    return this.y_;
  }
  set y(val) {
    this.y_ = val;
  }
  set x(val) {
    this.x_ = val;
  }
  update(x, y) {
    this.x_ = x;
    this.y_ = y;
  }
}

const arrayGrid = (r, c) =>
  new Array(r).fill(0).map(() => new Array(c).fill(0));
const printArrayGrid = (b) =>
  b.map((r) => r.map((e) => (e ? e : " ")).join("")).join("\n");

class Board {
  constructor() {
    this.board = new Array(1).fill(0).map(() => new Array(1).fill(0));
    this.center = new Point(0, 0);
    this.current = new Point(0, 0);
    this.rows = 1;
    this.cols = 1;
    this.board[0][0] = 4;
    this.distances = [Number.MAX_VALUE];
    this.counter = 0;
  }

  backToCenter() {
    this.current.update(this.center.x, this.center.y);
  }

  ensureRows(y_pos) {
    if (y_pos < 0) {
      this.board.unshift.apply(this.board, arrayGrid(-1 * y_pos, this.cols));
      this.rows = this.board.length;
      this.center.y = this.center.y - y_pos;
      this.current.y = this.current.y - y_pos;
    } else if (y_pos >= this.rows) {
      this.board.push.apply(
        this.board,
        arrayGrid(1 + y_pos - this.rows, this.cols)
      );
      this.rows = y_pos;
    }
    // board.print();
  }

  ensureCols(x_pos) {
    if (x_pos < 0) {
      this.board.forEach((row) =>
        row.unshift(this.board, new Array(0 - x_pos).fill(0))
      );
      this.cols = this.cols - x_pos;
      this.center.x = this.center.x - x_pos;
      this.current.x = this.current.x - x_pos;
    } else if (x_pos >= this.cols) {
      this.board.forEach((row) =>
        row.push.apply(row, new Array(1 + x_pos - this.cols).fill(0))
      );
      this.cols = x_pos + 1;
    }
    // board.print();
  }

  move(move, color) {
    switch (move.dir) {
      case "R":
        this.ensureCols(this.current.x + move.move);
        for (let c = 1; c <= move.move; c++)
          this.colorX(this.current.x + c, color);
        this.current.x = this.current.x + move.move;
        break;
      case "L":
        this.ensureCols(this.current.x - move.move);
        for (let c = 1; c <= move.move; c++)
          this.colorX(this.current.x - c, color);
        this.current.x = this.current.x - move.move;
        break;
      case "U":
        this.ensureRows(this.current.y + move.move);

        for (let c = 1; c <= move.move; c++) {
          this.colorY(this.current.y + c, color);
        }
        // console.log("ensureRows2", this.current.y, move.move, this.rows);
        this.current.y = this.current.y + move.move;
        break;
      case "D":
        this.ensureRows(this.current.y - move.move);
        for (let c = 1; c <= move.move; c++)
          this.colorY(this.current.y - c, color);
        this.current.y = this.current.y - move.move;
        break;
    }
    return this.current;
  }

  colorX(x, color) {
    this.board[this.current.y][x] = this.board[this.current.y][x] | color;
    //this.checkForCross(x, this.current.y, this.board[this.current.y][x]);
  }

  colorY(y, color) {
    this.board[y][this.current.x] = this.board[y][this.current.x] | color;
    this.checkForCross(this.current.x, y, this.board[y][this.current.x]);
  }

  checkForCross(x, y, c) {
    // console.log(this.counter++, this.rows, this.cols);
    if (c & 1 && c & 2) {
      let m = this.distances[0];
      let newd = Math.abs(this.center.x - x) + Math.abs(this.center.y - y);
      this.distances[0] = Math.min(newd, m);
    }
  }

  print() {
    console.log(
      "\n" +
        printArrayGrid(this.board) +
        `\n${this.center.x} ${this.center.y}\n`
    );
  }
}

function drawWire(from, move) {
  const ret = [];
  switch (move.dir) {
    case "R":
      for (let c = 1; c <= move.move; c++) ret.push([from.x + c, from.y]);
      return { x: from.x + move.move, y: from.y, wire: ret };
    case "L":
      for (let c = 1; c <= move.move; c++) ret.push([from.x - c, from.y]);
      return { x: from.x - move.move, y: from.y, wire: ret };
    case "U":
      for (let c = 1; c <= move.move; c++) ret.push([from.x, c + from.y]);
      return { x: from.x, y: from.y + move.move, wire: ret };

    case "D":
      for (let c = 1; c <= move.move; c++) ret.push([from.x, 0 - c + from.y]);
      return { x: from.x, y: from.y - move.move, wire: ret };
  }
  return { x: 0, y: 0, ret: [] };
}

function solution1(input) {
  const wire1 = input[0];
  const wire2 = input[1];
  console.log(wire1.length, wire2.length);
  board = new Board();
  const w1 = new Set();
  let x_ = 0;
  let y_ = 0;
  wire1.forEach((m, i) => {
    const { x, y, wire } = drawWire({ x: x_, y: y_ }, m);
    x_ = x;
    y_ = y;
    wire.forEach((c) => w1.add(`${c[0]},${c[1]}`));
  });

  const w2 = new Set();
  x_ = 0;
  y_ = 0;
  wire2.forEach((m, i) => {
    const { x, y, wire } = drawWire({ x: x_, y: y_ }, m);
    x_ = x;
    y_ = y;
    wire.forEach((c) => w2.add(`${c[0]},${c[1]}`));
  });
  const crosses = [...w1].filter((wc) => w2.has(wc));
  return crosses
    .map((c) =>
      c
        .replace(/-/g, "")
        .split(",")
        .map((n) => parseInt(n, 10))
    )
    .reduce((o, [a, b]) => {
      return o < a + b ? o : a + b;
    }, Number.MAX_VALUE);
}

function solution2(input) {
  const wire1 = input[0];
  const wire2 = input[1];

  board = new Board();
  const w1 = [];
  let x_ = 0;
  let y_ = 0;

  console.log("st1");
  wire1.forEach((m, i) => {
    const { x, y, wire } = drawWire({ x: x_, y: y_ }, m);
    x_ = x;
    y_ = y;
    wire.forEach((c) => w1.push(`${c[0]},${c[1]}`));
  });

  console.log("st2");
  const w2 = [];
  x_ = 0;
  y_ = 0;
  wire2.forEach((m, i) => {
    const { x, y, wire } = drawWire({ x: x_, y: y_ }, m);
    x_ = x;
    y_ = y;
    wire.forEach((c) => w2.push(`${c[0]},${c[1]}`));
  });

  console.log("st3");
  const trace1 = new Set(w1);
  const trace2 = new Set(w2);
  const crosses = [...trace1].filter((wc) => trace2.has(wc));
  console.log("st4");
  /*
  const distances = crosses.map((c) => {
    let d = c
      .replace(/-/g, "")
      .split(",")
      .map((n) => parseInt(n, 10));
    return { cross: c, distance: d[0] + d[1] };
  });

  const cross = distances.reduce(
    (a, d) => {
      if (d.distance < a.distance) {
        return d;
      }
      return a;
    },
    { cross: null, distance: Number.MAX_VALUE }
  );
  console.log(cross, w1);
  console.log(w2);
  return Math.min(
    w1.findIndex((w) => w === cross.cross),
    w2.findIndex((w) => w === cross.cross)
  );*/
  const distanceToCross = (w1, w2, cross) => {
    return w1.findIndex((w) => w === cross) + w2.findIndex((w) => w === cross);
  };
  return Math.min(...crosses.map((c) => distanceToCross(w1, w2, c)));
}

function solution(input) {
  // console.log(input);
  //return { part1: null, part2: null };
  return { part1: solution1(input), part2: solution2(input) };
}

module.exports = { input_parser, solution };
