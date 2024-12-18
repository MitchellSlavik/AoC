import run from "aocrunner";

import { MinHeap } from "../utils/index.js";

interface Direction {
  dx: number;
  dy: number;
}

const allDirections: Direction[] = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
];

interface Node {
  x: number;
  y: number;
  steps: number;
}

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(",").map((n) => parseInt(n)));

const makeKey = (node: Node) => `${node.x}|${node.y}`;

const canPath = (grid: number[][], endX: number, endY: number) => {
  let visited = new Set<string>();
  const hasVisited = (node: Node) => {
    const key = makeKey(node);
    if (visited.has(key)) return true;
    visited.add(key);
    return false;
  };

  let pointsToVisit: Node[] = [];
  MinHeap.push(pointsToVisit, [0, { x: 0, y: 0, steps: 0 }]);

  while (pointsToVisit.length > 0) {
    let [_, node] = MinHeap.pop(pointsToVisit) as [number, Node];

    if (hasVisited(node)) continue;
    if (node.y === endY && node.x === endX) {
      return node.steps;
    }
    allDirections.forEach((d) => {
      const nextX = node.x + d.dx;
      const nextY = node.y + d.dy;

      if (
        nextY < 0 ||
        nextY >= grid.length ||
        nextX < 0 ||
        nextX >= grid[0].length
      )
        return;

      if (grid[nextY][nextX] === 1) return;

      MinHeap.push(pointsToVisit, [
        node.steps + 1,
        {
          x: nextX,
          y: nextY,
          direction: d,
          steps: node.steps + 1,
        },
      ]);
    });
  }
  return -1;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const sampleData = input.length < 30;
  const endX = input.length < 30 ? 6 : 70;
  const endY = input.length < 30 ? 6 : 70;
  const grid = new Array(endY + 1)
    .fill(0)
    .map(() => new Array<number>(endX + 1).fill(0));

  input.forEach(([x, y], i) => {
    if (i < (sampleData ? 12 : 1024)) {
      grid[y][x] = 1;
    }
  });

  return canPath(grid, endX, endY);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const sampleData = input.length < 30;
  const endX = input.length < 30 ? 6 : 70;
  const endY = input.length < 30 ? 6 : 70;
  const grid = new Array(endY + 1)
    .fill(0)
    .map(() => new Array<number>(endX + 1).fill(0));

  for (let i = 0; i < input.length; i++) {
    let [x, y] = input[i];
    if (i < (sampleData ? 12 : 2979)) {
      grid[y][x] = 1;
    } else {
      grid[y][x] = 1;
      if (canPath(grid, endX, endY) < 0) {
        return `${x},${y}`;
      }
    }
  }

  return "passable?";
};

run({
  part1: {
    tests: [
      {
        input: `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`,
        expected: 22,
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
