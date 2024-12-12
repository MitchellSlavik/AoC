import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const makeKey = (y: number, x: number) => {
  return `${y}|${x}`;
};

const parseKey = (k: string) => {
  return k.split("|").map((n) => parseInt(n));
};

const inBounds = (grid: string[], y: number, x: number) => {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
};

const getAreaLocations = (
  grid: string[],
  y: number,
  x: number,
  lookingFor: string,
  locations: Record<string, boolean>
) => {
  if (
    inBounds(grid, y, x + 1) &&
    !locations[makeKey(y, x + 1)] &&
    grid[y][x + 1] === lookingFor
  ) {
    locations[makeKey(y, x + 1)] = true;
    getAreaLocations(grid, y, x + 1, lookingFor, locations);
  }
  if (
    inBounds(grid, y, x - 1) &&
    !locations[makeKey(y, x - 1)] &&
    grid[y][x - 1] === lookingFor
  ) {
    locations[makeKey(y, x - 1)] = true;
    getAreaLocations(grid, y, x - 1, lookingFor, locations);
  }
  if (
    inBounds(grid, y + 1, x) &&
    !locations[makeKey(y + 1, x)] &&
    grid[y + 1][x] === lookingFor
  ) {
    locations[makeKey(y + 1, x)] = true;
    getAreaLocations(grid, y + 1, x, lookingFor, locations);
  }
  if (
    inBounds(grid, y - 1, x) &&
    !locations[makeKey(y - 1, x)] &&
    grid[y - 1][x] === lookingFor
  ) {
    locations[makeKey(y - 1, x)] = true;
    getAreaLocations(grid, y - 1, x, lookingFor, locations);
  }
};

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);

  const seen: Record<string, boolean> = {};

  let sum = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (seen[makeKey(y, x)]) {
        continue;
      }

      const locations = { [makeKey(y, x)]: true };
      getAreaLocations(grid, y, x, grid[y][x], locations);

      const keys = Object.keys(locations);
      const perimeter = keys
        .map((k) => {
          seen[k] = true;
          const [y, x] = parseKey(k);
          let p = 0;
          if (!locations[makeKey(y, x + 1)]) {
            p++;
          }
          if (!locations[makeKey(y, x - 1)]) {
            p++;
          }
          if (!locations[makeKey(y + 1, x)]) {
            p++;
          }
          if (!locations[makeKey(y - 1, x)]) {
            p++;
          }
          return p;
        })
        .reduce((prev, curr) => prev + curr, 0);

      sum += keys.length * perimeter;
    }
  }

  return sum;
};

const combineWalls = (walls: [number, number][][], vertical: boolean) => {
  let combinedWalls = false;
  do {
    combinedWalls = false;
    for (let i = 0; i < walls.length; i++) {
      for (let i2 = i + 1; i2 < walls.length; i2++) {
        if (walls[i][0][vertical ? 0 : 1] === walls[i2][0][vertical ? 0 : 1]) {
          if (
            walls[i].some(([y, x]) =>
              walls[i2].some(
                ([y2, x2]) => Math.abs(vertical ? x2 - x : y2 - y) === 1
              )
            )
          ) {
            walls[i] = [...walls[i], ...walls[i2]];
            walls.splice(i2, 1);
            combinedWalls = true;
          }
        }
      }
    }
  } while (combinedWalls);
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);

  const seen: Record<string, boolean> = {};

  let sum = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (seen[makeKey(y, x)]) {
        continue;
      }

      const locations = { [makeKey(y, x)]: true };
      getAreaLocations(grid, y, x, grid[y][x], locations);

      const keys = Object.keys(locations);

      const rightWalls: [number, number][][] = [];
      const leftWalls: [number, number][][] = [];
      const downWalls: [number, number][][] = [];
      const upWalls: [number, number][][] = [];
      keys.forEach((k) => {
        seen[k] = true;
        const [y, x] = parseKey(k);
        if (!locations[makeKey(y, x + 1)]) {
          rightWalls.push([[y, x]]);
        }
        if (!locations[makeKey(y, x - 1)]) {
          leftWalls.push([[y, x]]);
        }
        if (!locations[makeKey(y + 1, x)]) {
          downWalls.push([[y, x]]);
        }
        if (!locations[makeKey(y - 1, x)]) {
          upWalls.push([[y, x]]);
        }
      });

      combineWalls(rightWalls, false);
      combineWalls(leftWalls, false);
      combineWalls(upWalls, true);
      combineWalls(downWalls, true);

      sum +=
        keys.length *
        (rightWalls.length +
          leftWalls.length +
          upWalls.length +
          downWalls.length);
    }
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1930,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`,
        expected: 236,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
