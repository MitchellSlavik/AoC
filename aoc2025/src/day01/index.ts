import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => parseInt(line.replace("R", "").replace("L", "-")));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let v = 0;
  let c = 50;
  for (let a = 0; a < input.length; a++) {
    c += input[a];
    if (c % 100 === 0) {
      v++;
    }
  }

  return v;
};

const toPosition = (c: number) => {
  let a = c % 100;
  if (a < 0) {
    return 100 + a;
  }
  return a;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let v = 0;
  let c = 50;
  for (let a = 0; a < input.length; a++) {
    let line = input[a];
    let next = c + line;

    v +=
      Math.abs(Math.floor(next / 100) - Math.floor(c / 100)) +
      (c === 0 && line < 0 ? -1 : 0) +
      (next % 100 === 0 && line > 0 ? -1 : 0) +
      (next % 100 === 0 ? 1 : 0);
    c = toPosition(next);
  }

  return v;
};

const example = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

run({
  part1: {
    tests: [
      {
        input: example,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: example,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
