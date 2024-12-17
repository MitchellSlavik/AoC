import run from "aocrunner";

import { MinHeap } from "../utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""));

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
  direction: Direction;
  points: number;
  path?: [number, number][];
}

const makeKey = (node: Node) =>
  `${node.x}|${node.y}|${node.direction.dx}|${node.direction.dy}`;

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);

  let visited = new Set<string>();
  const hasVisited = (node: Node) => {
    const key = makeKey(node);
    if (visited.has(key)) return true;
    visited.add(key);
    return false;
  };

  let pointsToVisit: Node[] = [];
  MinHeap.push(pointsToVisit, [
    0,
    { x: 1, y: grid.length - 2, direction: allDirections[1], points: 0 },
  ]);

  while (pointsToVisit.length > 0) {
    let [_, node] = MinHeap.pop(pointsToVisit) as [number, Node];

    if (hasVisited(node)) continue;
    if (grid[node.y][node.x] === "E") {
      return node.points;
    }
    allDirections.forEach((d) => {
      const { dx: currDx, dy: currDy } = node.direction;
      const { dx, dy } = d;
      const nextX = node.x + dx;
      const nextY = node.y + dy;

      if (
        nextY < 0 ||
        nextY >= grid.length ||
        nextX < 0 ||
        nextX >= grid[0].length
      )
        return;

      if (grid[nextY][nextX] === "#") return;

      if (dx === -currDx && dy === -currDy) return;

      const points = dx === currDx && dy === currDy ? 1 : 1001;

      MinHeap.push(pointsToVisit, [
        node.points + points,
        {
          x: nextX,
          y: nextY,
          direction: d,
          points: node.points + points,
        },
      ]);
    });
  }
  return 0;
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);

  let pointsToVisit: Node[] = [];
  MinHeap.push(pointsToVisit, [
    0,
    { x: 1, y: grid.length - 2, direction: allDirections[1], points: 0 },
  ]);

  let scores: Record<string, number> = {};
  let minScore = Infinity;
  let allPaths: Node[] = [];
  while (pointsToVisit.length > 0) {
    let [_, node] = MinHeap.pop(pointsToVisit) as [number, Node];
    let key = makeKey(node);

    if (minScore < Infinity && node.points > minScore) continue;

    if (scores[key] != null && scores[key] < node.points) continue;

    scores[key] = node.points;

    if (grid[node.y][node.x] === "E") {
      if (node.points < minScore) {
        minScore = node.points;
        allPaths = [];
      }
      allPaths.push(node);
      continue;
    }

    allDirections.forEach((d) => {
      const { dx: currDx, dy: currDy } = node.direction;
      const { dx, dy } = d;
      const nextX = node.x + dx;
      const nextY = node.y + dy;

      if (
        nextY < 0 ||
        nextY >= grid.length ||
        nextX < 0 ||
        nextX >= grid[0].length
      )
        return;

      if (grid[nextY][nextX] === "#") return;

      if (dx === -currDx && dy === -currDy) return;

      const points = dx === currDx && dy === currDy ? 1 : 1001;

      MinHeap.push(pointsToVisit, [
        node.points + points,
        {
          x: nextX,
          y: nextY,
          direction: d,
          points: node.points + points,
          path: node.path ? [...node.path, [nextX, nextY]] : [[nextX, nextY]],
        },
      ]);
    });
  }
  let minPathTiles = new Set<string>();
  minPathTiles.add(`${grid.length - 2}|1`);
  minPathTiles.add(`1|${grid[0].length - 2}`);
  allPaths.forEach((p) => {
    p.path?.forEach(([x, y]) => {
      minPathTiles.add(`${x}|${y}`);
    });
  });
  return minPathTiles.size;
};

const input = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;

const input2 = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 7036,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 45,
      },
      {
        input: input2,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
