import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const MAX_STEPS = 64;

const add = (
  arr: Record<string, boolean>,
  ele: [number, number],
  grid: string[][]
) => {
  if (
    ele[0] < 0 ||
    ele[0] >= grid[0].length ||
    ele[1] < 0 ||
    ele[1] >= grid.length
  ) {
    return;
  }
  if (grid[ele[1]][ele[0]] === "#") {
    return;
  }
  if (arr[toKey(ele)] !== undefined) {
    return;
  }
  arr[toKey(ele)] = false;
};

const toKey = (ele: [number, number]) => ele.join(",");
const fromKey = (key: string) => key.split(",").map(Number) as [number, number];

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let startY = 0,
    startX = 0;

  const grid = input.split("\n").map((line, index) => {
    if (line.includes("S")) {
      startX = line.indexOf("S");
      startY = index;
    }

    return line.split("");
  });

  let locations: [number, number][] = [[startX, startY]];
  let nextLocations: Record<string, boolean> = {};

  let steps = 0;
  while (steps < MAX_STEPS) {
    for (let i = 0; i < locations.length; i++) {
      const loc = locations[i];

      add(nextLocations, [loc[0] - 1, loc[1]], grid);
      add(nextLocations, [loc[0] + 1, loc[1]], grid);

      add(nextLocations, [loc[0], loc[1] - 1], grid);
      add(nextLocations, [loc[0], loc[1] + 1], grid);
    }

    locations = Object.keys(nextLocations).map(fromKey);
    nextLocations = {};
    steps++;
  }
  return locations.length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let startY = 0,
    startX = 0;

  let grid = input.split("\n").map((line, index) => {
    let nLine = line;
    if (line.includes("S")) {
      startX = line.indexOf("S");
      startY = index;
    }

    return nLine.repeat(5).split("");
  });

  let gridSize = grid.length;

  startX += gridSize * 2;
  startY += gridSize * 2;

  grid = [...grid, ...grid, ...grid, ...grid, ...grid];

  const [y0, y1, y2] = [
    Math.floor(gridSize * 0.5),
    Math.floor(gridSize * 1.5),
    Math.floor(gridSize * 2.5),
  ].map((maxSteps) => {
    let locations: [number, number][] = [[startX, startY]];
    let nextLocations: Record<string, boolean>;
    let oddSteps: Record<string, boolean> = {};
    let evenSteps: Record<string, boolean> = {};
    let steps = 0;
    while (steps < maxSteps) {
      nextLocations = steps % 2 === 0 ? oddSteps : evenSteps;
      for (let i = 0; i < locations.length; i++) {
        const loc = locations[i];

        add(nextLocations, [loc[0] - 1, loc[1]], grid);
        add(nextLocations, [loc[0] + 1, loc[1]], grid);

        add(nextLocations, [loc[0], loc[1] - 1], grid);
        add(nextLocations, [loc[0], loc[1] + 1], grid);
      }

      let falseKeys = Object.keys(nextLocations).filter(
        (loc) => nextLocations[loc] === false
      );

      locations = falseKeys.map(fromKey);

      falseKeys.forEach((k) => {
        nextLocations[k] = true;
      });

      steps++;
    }
    return Object.keys(nextLocations).length;
  });

  // determine quadratic a b c
  let c = y0;
  let b = (4 * y1 - y2 - 3 * c) / 2;
  let a = y1 - c - b;

  let x = Math.floor(26501365 / gridSize);

  return a * x * x + b * x + c;
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
