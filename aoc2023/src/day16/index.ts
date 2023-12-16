import run from "aocrunner";

interface Spot {
  empty: boolean;
  forwardMirror: boolean;
  backMirror: boolean;
  horizontalSplitter: boolean;
  verticalSplitter: boolean;
  lightNorth: boolean;
  lightSouth: boolean;
  lightEast: boolean;
  lightWest: boolean;
}

type Direction = "north" | "south" | "east" | "west";

const blankSpot = (): Spot => ({
  empty: false,
  forwardMirror: false,
  backMirror: false,
  horizontalSplitter: false,
  verticalSplitter: false,
  lightNorth: false,
  lightSouth: false,
  lightEast: false,
  lightWest: false,
});

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    return line.split("").map<Spot>((c) => {
      const s = blankSpot();
      switch (c) {
        case ".":
          s.empty = true;
          break;
        case "/":
          s.forwardMirror = true;
          break;
        case "\\":
          s.backMirror = true;
          break;
        case "-":
          s.horizontalSplitter = true;
          break;
        case "|":
          s.verticalSplitter = true;
          break;
      }
      return s;
    });
  });

const resetGrid = (grid: Spot[][]) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const s = grid[y][x];
      s.lightEast = false;
      s.lightNorth = false;
      s.lightSouth = false;
      s.lightWest = false;
    }
  }
};

const traceLight = (
  grid: Spot[][],
  x: number,
  y: number,
  comingFromDir: Direction
) => {
  if (y >= 0 && y < grid.length) {
    if (x >= 0 && x < grid[y].length) {
      const s = grid[y][x];
      if (comingFromDir === "north") {
        if (!s.lightNorth) {
          s.lightNorth = true;
          if (s.empty || s.verticalSplitter) {
            traceLight(grid, x, y + 1, "north");
          } else if (s.backMirror) {
            traceLight(grid, x + 1, y, "west");
          } else if (s.forwardMirror) {
            traceLight(grid, x - 1, y, "east");
          } else if (s.horizontalSplitter) {
            traceLight(grid, x - 1, y, "east");
            traceLight(grid, x + 1, y, "west");
          }
        }
      } else if (comingFromDir === "east") {
        if (!s.lightEast) {
          s.lightEast = true;
          if (s.empty || s.horizontalSplitter) {
            traceLight(grid, x - 1, y, "east");
          } else if (s.backMirror) {
            traceLight(grid, x, y - 1, "south");
          } else if (s.forwardMirror) {
            traceLight(grid, x, y + 1, "north");
          } else if (s.verticalSplitter) {
            traceLight(grid, x, y + 1, "north");
            traceLight(grid, x, y - 1, "south");
          }
        }
      } else if (comingFromDir === "west") {
        if (!s.lightWest) {
          s.lightWest = true;
          if (s.empty || s.horizontalSplitter) {
            traceLight(grid, x + 1, y, "west");
          } else if (s.backMirror) {
            traceLight(grid, x, y + 1, "north");
          } else if (s.forwardMirror) {
            traceLight(grid, x, y - 1, "south");
          } else if (s.verticalSplitter) {
            traceLight(grid, x, y + 1, "north");
            traceLight(grid, x, y - 1, "south");
          }
        }
      } else if (comingFromDir === "south") {
        if (!s.lightSouth) {
          s.lightSouth = true;
          if (s.empty || s.verticalSplitter) {
            traceLight(grid, x, y - 1, "south");
          } else if (s.backMirror) {
            traceLight(grid, x - 1, y, "east");
          } else if (s.forwardMirror) {
            traceLight(grid, x + 1, y, "west");
          } else if (s.horizontalSplitter) {
            traceLight(grid, x - 1, y, "east");
            traceLight(grid, x + 1, y, "west");
          }
        }
      }
    }
  }
};

const calculateEnergizedCount = (grid: Spot[][]) =>
  grid.reduce(
    (prev, curr) =>
      prev +
      curr.reduce(
        (p, c) =>
          p +
          (c.lightEast || c.lightNorth || c.lightSouth || c.lightWest ? 1 : 0),
        0
      ),
    0
  );

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  traceLight(grid, 0, 0, "west");
  return calculateEnergizedCount(grid);
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);

  const edgeStarts: Array<[number, number, Direction]> = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (y === 0) {
        edgeStarts.push([x, y, "north"]);
      }
      if (x === 0) {
        edgeStarts.push([x, y, "west"]);
      }
      if (x === grid[y].length - 1) {
        edgeStarts.push([x, y, "east"]);
      }
      if (y === grid.length - 1) {
        edgeStarts.push([x, y, "south"]);
      }
    }
  }

  return Math.max(
    ...edgeStarts.map((t) => {
      resetGrid(grid);
      traceLight(grid, ...t);
      return calculateEnergizedCount(grid);
    })
  );
};

const input = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 46,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 51,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
