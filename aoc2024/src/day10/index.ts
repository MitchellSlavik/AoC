import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split("").map((n) => parseInt(n)));

const inBounds = (grid: number[][], y: number, x: number) => {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
};

const path = (
  grid: number[][],
  y: number,
  x: number,
  lookingFor: number,
  peaks: Set<string>,
) => {
  if (!inBounds(grid, y, x)) {
    return;
  }
  if (grid[y][x] !== lookingFor) {
    return;
  }

  if (lookingFor === 9 && grid[y][x] === 9) {
    peaks.add(`${y}|${x}`);
    return;
  }

  path(grid, y, x - 1, lookingFor + 1, peaks);
  path(grid, y, x + 1, lookingFor + 1, peaks);
  path(grid, y + 1, x, lookingFor + 1, peaks);
  path(grid, y - 1, x, lookingFor + 1, peaks);
};

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);

  let sum = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 0) {
        const peaks = new Set<string>();
        path(grid, y, x, 0, peaks);
        sum += peaks.size;
      }
    }
  }

  return sum;
};

const path2 = (grid: number[][], y: number, x: number, lookingFor: number) => {
  if (!inBounds(grid, y, x)) {
    return 0;
  }
  if (grid[y][x] !== lookingFor) {
    return 0;
  }

  if (lookingFor === 9 && grid[y][x] === 9) {
    return 1;
  }

  return (
    path2(grid, y, x - 1, lookingFor + 1) +
    path2(grid, y, x + 1, lookingFor + 1) +
    path2(grid, y + 1, x, lookingFor + 1) +
    path2(grid, y - 1, x, lookingFor + 1)
  );
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);

  let sum = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      sum += path2(grid, y, x, 0);
    }
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 36,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
