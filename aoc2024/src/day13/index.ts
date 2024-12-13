import run from "aocrunner";

interface Machine {
  aX: number;
  aY: number;
  bX: number;
  bY: number;
  pX: number;
  pY: number;
}

const parseInput = (rawInput: string, p2: boolean = false): Machine[] =>
  rawInput
    .split("\n\n")
    .map((sec) =>
      sec
        .split("\n")
        .map((line) => [...line.matchAll(/\d+/g)].map(([m]) => parseInt(m)))
    )
    .map((v) => ({
      aX: v[0][0],
      aY: v[0][1],
      bX: v[1][0],
      bY: v[1][1],
      pX: v[2][0] + (p2 ? 10000000000000 : 0),
      pY: v[2][1] + (p2 ? 10000000000000 : 0),
    }));

const solve = ({ aX, aY, bX, bY, pX, pY }: Machine) => {
  let b = Math.floor((pY * aX - pX * aY) / (aX * bY - aY * bX));
  let a = Math.floor((pX - b * bX) / aX);
  return aX * a + bX * b === pX && aY * a + bY * b === pY ? a * 3 + b : 0;
};

const part1 = (rawInput: string) => {
  return parseInput(rawInput)
    .map(solve)
    .reduce((prev, curr) => prev + curr, 0);
};

const part2 = (rawInput: string) => {
  return parseInput(rawInput, true)
    .map(solve)
    .reduce((prev, curr) => prev + curr, 0);
};

const input = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 480,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
