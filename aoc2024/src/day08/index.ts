import run from "aocrunner";

interface Position {
  x: number;
  y: number;
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  const antennas: Record<string, Position[]> = {};
  lines.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      if (line[x] !== ".") {
        if (antennas[line[x]]) {
          antennas[line[x]].push({ x, y });
        } else {
          antennas[line[x]] = [{ x, y }];
        }
      }
    }
  });
  return { antennas, maxX: lines[0].length - 1, maxY: lines.length - 1 };
};

const part2 = (rawInput: string) => {
  const { antennas, maxX, maxY } = parseInput(rawInput);
  const antinodes = new Set<string>();

  const inBounds = (x: number, y: number) => {
    return x >= 0 && x <= maxX && y >= 0 && y <= maxY;
  };

  Object.keys(antennas).forEach((antennaKey) => {
    const positions = antennas[antennaKey];

    for (let a = 0; a < positions.length; a++) {
      for (let b = 0; b < positions.length; b++) {
        if (a === b) {
          continue;
        }

        const aPos = positions[a];
        const bPos = positions[b];

        antinodes.add(`${aPos.x}|${aPos.y}`);
        antinodes.add(`${bPos.x}|${bPos.y}`);

        const xDiff = aPos.x - bPos.x;
        const yDiff = aPos.y - bPos.y;

        let currPos = bPos;
        while (inBounds(currPos.x - xDiff, currPos.y - yDiff)) {
          antinodes.add(`${currPos.x - xDiff}|${currPos.y - yDiff}`);
          currPos = { x: currPos.x - xDiff, y: currPos.y - yDiff };
        }
        currPos = aPos;
        while (inBounds(currPos.x + xDiff, currPos.y + yDiff)) {
          antinodes.add(`${currPos.x + xDiff}|${currPos.y + yDiff}`);
          currPos = { x: currPos.x + xDiff, y: currPos.y + yDiff };
        }
      }
    }
  });
  return antinodes.size;
};

const part1 = (rawInput: string) => {
  const { antennas, maxX, maxY } = parseInput(rawInput);
  const antinodes = new Set<string>();

  const inBounds = (x: number, y: number) => {
    return x >= 0 && x <= maxX && y >= 0 && y <= maxY;
  };

  Object.keys(antennas).forEach((antennaKey) => {
    const positions = antennas[antennaKey];

    for (let a = 0; a < positions.length; a++) {
      for (let b = 0; b < positions.length; b++) {
        if (a === b) {
          continue;
        }

        const aPos = positions[a];
        const bPos = positions[b];

        const xDiff = aPos.x - bPos.x;
        const yDiff = aPos.y - bPos.y;

        if (inBounds(bPos.x - xDiff, bPos.y - yDiff)) {
          antinodes.add(`${bPos.x - xDiff}|${bPos.y - yDiff}`);
        }
        if (inBounds(aPos.x + xDiff, aPos.y + yDiff)) {
          antinodes.add(`${aPos.x + xDiff}|${aPos.y + yDiff}`);
        }
      }
    }
  });
  return antinodes.size;
};

run({
  part1: {
    tests: [
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 34,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
