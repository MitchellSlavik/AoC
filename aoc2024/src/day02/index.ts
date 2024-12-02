import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(" ").map((n) => parseInt(n)));

const checkSafe = (report: number[]): boolean => {
  let direction = 0;
  let safe = true;
  for (let i = 1; i < report.length; i++) {
    const a = report[i - 1];
    const b = report[i];

    if (direction === 0) {
      direction = Math.sign(b - a);
      if (direction == 0) {
        safe = false;
      }
    } else if (direction === -1) {
      if (b - a >= 0) {
        safe = false;
      }
    } else if (direction === 1) {
      if (b - a <= 0) {
        safe = false;
      }
    }

    if (Math.abs(b - a) < 1 || Math.abs(b - a) > 3) {
      safe = false;
    }
  }
  return safe;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.filter(checkSafe).length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.filter((report) => {
    if (checkSafe(report)) {
      return true;
    } else {
      return report
        .map((_, i) => {
          const newReport = report.slice();
          newReport.splice(i, 1);
          return newReport;
        })
        .some((nr) => checkSafe(nr));
    }
  }).length;
};

run({
  part1: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
