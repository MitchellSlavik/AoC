import run from "aocrunner";

import { MinHeap } from "../utils/index.js";

const parseInput = (input: string) =>
  input.split("\n").map((row) => [...row].map(Number));

const DIR = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const solve = (
  grid: number[][],
  condition: (prevSteps: number, currSteps) => boolean
) => {
  const visited = new Map();
  const [targetX, targetY] = [grid[0].length - 1, grid.length - 1];
  const queue = [
    [0, 0, [0, 0], 1, 0],
    [0, 0, [0, 0], 2, 0],
  ];
  while (queue.length) {
    const [, energy, [currX, currY], currHeading, currSteps] =
      MinHeap.pop(queue);
    if (
      currX === targetX &&
      currY === targetY &&
      condition(currSteps, currSteps)
    ) {
      return energy;
    }
    DIR.map((direction, heading) => [
      direction,
      heading,
      heading === currHeading ? currSteps + 1 : 1,
    ])
      .map(([[dx, dy], ...rest]) => [[currX + dx, currY + dy], ...rest])
      .filter(
        ([[x, y], heading]) => grid[y]?.[x] && (heading + 2) % 4 !== currHeading
      )
      .filter(([, , steps]) => condition(currSteps, steps))
      .map(([[x, y], heading, steps]) => [
        energy + grid[y][x],
        [x, y],
        heading,
        steps,
      ])
      .filter(
        ([newEnergy, [x, y], heading, steps]) =>
          (visited.get((y << 16) | (x << 8) | (heading << 4) | steps) ??
            Infinity) > newEnergy &&
          visited.set((y << 16) | (x << 8) | (heading << 4) | steps, newEnergy)
      )
      .forEach(([newEnergy, [newX, newY], h, steps]) =>
        MinHeap.push(queue, [
          newEnergy + (targetX - newX) + (targetY - newY),
          newEnergy,
          [newX, newY],
          h,
          steps,
        ])
      );
  }
  return -1;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return solve(input, (_, steps) => steps < 4);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return solve(
    input,
    (prevSteps, steps) => (steps > prevSteps || prevSteps >= 4) && steps < 11
  );
};

const input = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const input2 = `
111111111111
999999999991
999999999991
999999999991
999999999991`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 102,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: 94,
      },
      {
        input: input2,
        expected: 71,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
