import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.replace("S", "|").split(""));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let splits = 0;
  for (let y = 0; y < input.length - 1; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "|") {
        if (input[y + 1][x] === "^") {
          splits++;
          input[y + 1][x - 1] = "|";
          input[y + 1][x + 1] = "|";
        } else if (input[y + 1][x] === ".") {
          input[y + 1][x] = "|";
        }
      }
    }
  }

  return splits;
};

let timelineCache: Record<string, number> = {};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let y = input.length - 1; y >= 0; y--) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "^") {
        // trace particles down
        let timelines = 0;
        let particles = [
          [y, x - 1],
          [y, x + 1],
        ];
        while (particles.length > 0) {
          let particle = particles.shift();
          while (particle[0] < input.length - 1) {
            particle[0]++;
            if (timelineCache[`${particle[0]}|${particle[1]}`]) {
              timelines += timelineCache[`${particle[0]}|${particle[1]}`];
              break;
            }
          }
          if (particle[0] === input.length - 1) {
            timelines++;
          }
        }
        timelineCache[`${y}|${x}`] = timelines;
      }
    }
  }

  // trace starting | till we hit the cache
  let index = input[0].indexOf("|");
  for (let y = 0; y < input.length; y++) {
    if (timelineCache[`${y}|${index}`]) {
      return timelineCache[`${y}|${index}`];
    }
  }
  return 1;
};

const input = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

run({
  part1: {
    tests: [
      {
        input: input,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: 40,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
