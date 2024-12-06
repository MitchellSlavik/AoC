import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const inBounds = (grid: string[], x: number, y: number) => {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
};

const turnRight = (dirX: number, dirY: number) => {
  if (dirY === -1) {
    return [1, 0];
  } else if (dirX === 1) {
    return [0, 1];
  } else if (dirY === 1) {
    return [-1, 0];
  } else {
    return [0, -1];
  }
};

const walkRoute = (grid: string[]) => {
  let startX = 0;
  let startY = 0;
  let currX = 0;
  let currY = 0;
  let dirX = 0;
  let dirY = -1;

  for (let y = 0; y < grid.length; y++) {
    const index = grid[y].indexOf("^");
    if (index >= 0) {
      currX = startX = index;
      currY = startY = y;
      break;
    }
  }
  const positions = new Set<string>();
  const previousPositions: Record<string, number[]> = {};

  while (inBounds(grid, currX, currY)) {
    const key = `${currX}|${currY}`;
    positions.add(key);
    if (!previousPositions[key]) {
      previousPositions[key] = [currX - dirX, currY - dirY];
    }
    if (
      inBounds(grid, currX + dirX, currY + dirY) &&
      grid[currY + dirY][currX + dirX] === "#"
    ) {
      [dirX, dirY] = turnRight(dirX, dirY);
    } else {
      currX += dirX;
      currY += dirY;
    }
  }
  return { startX, startY, positions, previousPositions };
};

const lookForLoop = (
  grid: string[],
  x: number,
  y: number,
  dx: number,
  dy: number
) => {
  let currX = x;
  let currY = y;
  let dirX = dx;
  let dirY = dy;
  const positions: Record<string, string[]> = {};
  while (inBounds(grid, currX, currY)) {
    const key = `${currX}|${currY}`;
    const dirKey = `${dirX}|${dirY}`;
    if (positions[key]) {
      if (positions[key].includes(dirKey)) {
        return true;
      }
      positions[key].push(dirKey);
    } else {
      positions[key] = [dirKey];
    }

    if (
      inBounds(grid, currX + dirX, currY + dirY) &&
      grid[currY + dirY][currX + dirX] === "#"
    ) {
      [dirX, dirY] = turnRight(dirX, dirY);
    } else {
      currX += dirX;
      currY += dirY;
    }
  }
  return false;
};

const part1 = (rawInput: string) => {
  return walkRoute(parseInput(rawInput)).positions.size;
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const { positions, startX, startY, previousPositions } = walkRoute(grid);

  return [...positions]
    .map((pos) => {
      if (pos === `${startX}|${startY}`) return false;
      const [x, y] = pos.split("|").map((n) => parseInt(n));
      const [prevX, prevY] = previousPositions[pos];
      const orig = grid[y];
      grid[y] = grid[y].substring(0, x) + "#" + grid[y].substring(x + 1);
      const loop = lookForLoop(grid, prevX, prevY, x - prevX, y - prevY);
      grid[y] = orig;
      return loop;
    })
    .reduce((prev, curr) => prev + (curr ? 1 : 0), 0);
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
