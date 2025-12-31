import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.split("").map((n) => parseInt(n)));

const part1 = (rawInput: string) => {
  return parseInput(rawInput).reduce(
    (prev, curr) => prev + findBattery(curr, 2),
    0,
  );
};

const getLargest = (l: number[], digits: number) => {
  let largest = Math.max(...l.slice(0, l.length - digits + 1));
  let largestIndex = l.indexOf(largest);
  return [largest, largestIndex];
};

const findBattery = (l: number[], digits: number) => {
  let temp = l.slice();
  let n = [];
  for (let i = digits; i > 0; i--) {
    let [largest, largestIndex] = getLargest(temp, i);
    n.push(largest);
    temp = temp.slice(largestIndex + 1);
  }
  return parseInt(n.join(""));
};

const part2 = (rawInput: string) => {
  return parseInput(rawInput).reduce(
    (prev, curr) => prev + findBattery(curr, 12),
    0,
  );
};

const input = `987654321111111
811111111111119
234234234234278
818181911112111`;

run({
  part1: {
    tests: [
      {
        input: input,
        expected: 357,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: 3121910778619,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
