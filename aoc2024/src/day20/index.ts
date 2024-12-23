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

const parseInput = (rawInput: string) => {
  const grid = rawInput.split("\n").map((line) => line.split(""));

  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      if (grid[y][x] === "S") {
        startX = x;
        startY = y;
      }
      if (grid[y][x] === "E") {
        endX = x;
        endY = y;
      }
    }
  }

  return { grid, startX, startY, endX, endY };
};

const makeKey = (node: Node) => `${node.x}|${node.y}`;

const part1 = (rawInput: string) => {
  const { endX, endY, grid } = parseInput(rawInput);

  const visited = new Set<string>();
  const hasVisited = (node: Node) => {
    const key = makeKey(node);
    if (visited.has(key)) {
      return true;
    }
    visited.add(key);
    return false;
  };

  const toVisit: Node[] = [];
  const distanceToEnd: Record<string, number> = {};
  toVisit.push({ steps: 0, x: endX, y: endY });
  while (toVisit.length > 0) {
    const node = toVisit.pop();
    const nodeKey = makeKey(node);
    if (hasVisited(node)) {
      if (
        distanceToEnd[nodeKey] != undefined &&
        node.steps < distanceToEnd[nodeKey]
      ) {
        distanceToEnd[nodeKey] = node.steps;
      }
    } else {
      distanceToEnd[nodeKey] = node.steps;

      allDirections.forEach((d) => {
        const nextX = d.dx + node.x;
        const nextY = d.dy + node.y;

        if (
          nextX < 0 ||
          nextY < 0 ||
          nextY >= grid.length ||
          nextX >= grid[0].length
        ) {
          return;
        }

        if (grid[nextY][nextX] === "#") {
          return;
        }

        toVisit.push({
          x: nextX,
          y: nextY,
          steps: node.steps + 1,
        });
      });
    }
  }
  let cheats = 0;
  const saves: Record<number, number> = {};
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== "#") {
        let startDist = distanceToEnd[makeKey({ x, y, steps: 0 })];
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            let nextX = x + dx;
            let nextY = y + dy;
            if (
              nextX < 0 ||
              nextY < 0 ||
              nextY >= grid.length ||
              nextX >= grid[0].length
            ) {
              continue;
            }
            if (Math.abs(dy) + Math.abs(dx) === 2) {
              if (Math.abs(dy) === 1 && Math.abs(dx) === 1) {
                if (grid[y + dy][x] !== "#" || grid[y][x + dx] !== "#") {
                  continue;
                }
              } else {
                if (grid[y + dy / 2][x + dx / 2] !== "#") {
                  continue;
                }
              }

              if (grid[y + dy][x + dx] !== "#") {
                let endDist =
                  distanceToEnd[makeKey({ x: nextX, y: nextY, steps: 0 })];

                if (startDist - endDist - 2 >= (grid.length < 20 ? 0 : 100)) {
                  cheats++;
                }
              }
            }
          }
        }
      }
    }
  }
  return cheats;
};

const part2 = (rawInput: string) => {
  const { endX, endY, grid } = parseInput(rawInput);

  const visited = new Set<string>();
  const hasVisited = (node: Node) => {
    const key = makeKey(node);
    if (visited.has(key)) {
      return true;
    }
    visited.add(key);
    return false;
  };

  const toVisit: Node[] = [];
  const distanceToEnd: Record<string, number> = {};
  toVisit.push({ steps: 0, x: endX, y: endY });
  while (toVisit.length > 0) {
    const node = toVisit.pop();
    const nodeKey = makeKey(node);
    if (hasVisited(node)) {
      if (
        distanceToEnd[nodeKey] != undefined &&
        node.steps < distanceToEnd[nodeKey]
      ) {
        distanceToEnd[nodeKey] = node.steps;
      }
    } else {
      distanceToEnd[nodeKey] = node.steps;

      allDirections.forEach((d) => {
        const nextX = d.dx + node.x;
        const nextY = d.dy + node.y;

        if (
          nextX < 0 ||
          nextY < 0 ||
          nextY >= grid.length ||
          nextX >= grid[0].length
        ) {
          return;
        }

        if (grid[nextY][nextX] === "#") {
          return;
        }

        toVisit.push({
          x: nextX,
          y: nextY,
          steps: node.steps + 1,
        });
      });
    }
  }
  let cheats = 0;
  const saves: Record<number, number> = {};
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== "#") {
        let startDist = distanceToEnd[makeKey({ x, y, steps: 0 })];
        for (let dy = -20; dy <= 20; dy++) {
          for (let dx = -20; dx <= 20; dx++) {
            let nextX = x + dx;
            let nextY = y + dy;
            if (
              nextX < 0 ||
              nextY < 0 ||
              nextY >= grid.length ||
              nextX >= grid[0].length ||
              grid[nextY][nextX] === "#"
            ) {
              continue;
            }
            const cheatDist = Math.abs(dy) + Math.abs(dx);
            if (cheatDist <= 20 && cheatDist > 0) {
              let endDist =
                distanceToEnd[makeKey({ x: nextX, y: nextY, steps: 0 })];

              let cheatedDistSaved = startDist - endDist - cheatDist;
              if (cheatedDistSaved >= (grid.length < 20 ? 50 : 100)) {
                cheats++;
                if (saves[cheatedDistSaved]) {
                  saves[cheatedDistSaved]++;
                } else {
                  saves[cheatedDistSaved] = 1;
                }
              }
            }
          }
        }
      }
    }
  }
  return cheats;
};

const input = `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 44,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 285,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
