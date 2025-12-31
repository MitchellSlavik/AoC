import run from "aocrunner";

const parseInputP1 = (rawInput: string): [number[][], string[]] => {
  let a = rawInput
    .replace(/[ ]+/g, " ")
    .split("\n")
    .map((l) => l.trim().split(" "));
  return [
    a.slice(0, -1).map((l) => l.map((n) => parseInt(n))),
    a[a.length - 1],
  ];
};

const part1 = (rawInput: string) => {
  const [matrix, operations] = parseInputP1(rawInput);
  let sum = 0;

  for (let c = 0; c < operations.length; c++) {
    let colResult = operations[c] === "*" ? 1 : 0;
    for (let r = 0; r < matrix.length; r++) {
      if (operations[c] === "*") {
        colResult *= matrix[r][c];
      } else {
        colResult += matrix[r][c];
      }
    }
    sum += colResult;
  }

  return sum;
};

const parseInputP2 = (rawInput: string): [number[][], string[]] => {
  const lines = rawInput.split("\n");
  const matrixLines = lines.slice(0, -1);
  const operations = lines[lines.length - 1]
    .replace(/[ ]+/g, " ")
    .trim()
    .split(" ");
  const matrix: number[][] = [[]];
  for (let x = 0; x < matrixLines[0].length; x++) {
    let assembledNumber = "";
    for (let y = 0; y < matrixLines.length; y++) {
      assembledNumber += matrixLines[y][x];
    }
    if (assembledNumber.trim().length === 0) {
      matrix.push([]);
      continue;
    }
    matrix[matrix.length - 1].push(parseInt(assembledNumber.trim()));
  }
  return [matrix, operations];
};

const part2 = (rawInput: string) => {
  const [matrix, operations] = parseInputP2(rawInput);

  let sum = 0;

  for (let c = 0; c < operations.length; c++) {
    let colResult = operations[c] === "*" ? 1 : 0;
    for (let r = 0; r < matrix[c].length; r++) {
      if (operations[c] === "*") {
        colResult *= matrix[c][r];
      } else {
        colResult += matrix[c][r];
      }
    }
    sum += colResult;
  }

  return sum;
};

const input = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +`;

run({
  part1: {
    tests: [
      {
        input: input,
        expected: 4277556,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: 3263827,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
