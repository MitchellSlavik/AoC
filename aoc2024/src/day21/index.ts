import run from "aocrunner";

interface Position {
  x: number;
  y: number;
}

const BFS_DIRECTIONS: Record<string, Position> = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
};

const KEYPAD: Record<string, Position> = {
  7: { x: 0, y: 0 },
  8: { x: 1, y: 0 },
  9: { x: 2, y: 0 },
  4: { x: 0, y: 1 },
  5: { x: 1, y: 1 },
  6: { x: 2, y: 1 },
  1: { x: 0, y: 2 },
  2: { x: 1, y: 2 },
  3: { x: 2, y: 2 },
  X: { x: 0, y: 3 },
  0: { x: 1, y: 3 },
  A: { x: 2, y: 3 },
};

const DIRECTIONS: Record<string, Position> = {
  X: { x: 0, y: 0 },
  "^": { x: 1, y: 0 },
  A: { x: 2, y: 0 },
  "<": { x: 0, y: 1 },
  v: { x: 1, y: 1 },
  ">": { x: 2, y: 1 },
};

const getCommand = (
  input: Record<string, Position>,
  start: string,
  end: string
) => {
  const queue = [{ ...input[start], path: "" }];
  const distances: Record<string, number> = {};

  if (start === end) return ["A"];

  const allPaths: string[] = [];
  while (queue.length) {
    const current = queue.shift();
    if (current === undefined) break;

    if (current.x === input[end].x && current.y === input[end].y)
      allPaths.push(current.path + "A");
    if (
      distances[`${current.x},${current.y}`] !== undefined &&
      distances[`${current.x},${current.y}`] < current.path.length
    )
      continue;

    Object.entries(BFS_DIRECTIONS).forEach(([direction, { x: dx, y: dy }]) => {
      let nextX = current.x + dx;
      let nextY = current.y + dy;

      if (input.X.x === nextX && input.X.y === nextY) return;

      if (Object.values(input).find(({ x, y }) => x === nextX && y === nextY)) {
        const newPath = current.path + direction;
        if (
          distances[`${nextX},${nextY}`] === undefined ||
          distances[`${nextX},${nextY}`] >= newPath.length
        ) {
          queue.push({ x: nextX, y: nextY, path: newPath });
          distances[`${nextX},${nextY}`] = newPath.length;
        }
      }
    });
  }
  return allPaths.sort((a, b) => a.length - b.length);
};

let memo: Record<string, number> = {};

const getKeyPresses = (
  map: Record<string, Position>,
  code: string,
  robot: number
): number => {
  const key = `${code},${robot}`;
  if (memo[key] !== undefined) return memo[key];

  let current = "A";
  let length = 0;
  for (let i = 0; i < code.length; i++) {
    const moves = getCommand(map, current, code[i]);
    if (robot === 0) length += moves[0].length;
    else
      length += Math.min(
        ...moves.map((move) => getKeyPresses(DIRECTIONS, move, robot - 1))
      );
    current = code[i];
  }

  memo[key] = length;
  return length;
};

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  memo = {};

  return input.reduce((prev, line) => {
    const commandLength = getKeyPresses(KEYPAD, line, 2);
    let numeric = parseInt(line.substring(0, line.length - 1));

    return prev + numeric * commandLength;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  memo = {};

  return input.reduce((prev, line) => {
    const commandLength = getKeyPresses(KEYPAD, line, 25);
    let numeric = parseInt(line.substring(0, line.length - 1));

    return prev + numeric * commandLength;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `029A
980A
179A
456A
379A`,
        expected: 126384,
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
