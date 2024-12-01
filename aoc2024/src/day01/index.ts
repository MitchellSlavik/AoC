import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((l) => l.split("   ").map((n) => parseInt(n)))
    .reduce(
      (prev, curr) => {
        prev[0].push(curr[0]);
        prev[1].push(curr[1]);
        return prev;
      },
      [[], []] as number[][],
    )
    .map((a) => a.sort());

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let diff = 0;

  for (let i = 0; i < input[0].length; i++) {
    diff += Math.abs(input[0][i] - input[1][i]);
  }

  return diff;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let simScore = 0;
  let counts: Record<number, number> = {};

  for (let i = 0; i < input[1].length; i++) {
    if (counts[input[1][i]]) {
      counts[input[1][i]]++;
    } else {
      counts[input[1][i]] = 1;
    }
  }

  for (let i = 0; i < input[0].length; i++) {
    simScore += input[0][i] * (counts[input[0][i]] ?? 0);
  }

  return simScore;
};

run({
  part1: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
