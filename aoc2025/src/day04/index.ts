import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.split(""));

const countAdjacent = (input: string[][], y: number, x: number) => {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      if (
        y + dy < 0 ||
        y + dy >= input.length ||
        x + dx < 0 ||
        x + dx >= input[y + dy].length
      )
        continue;
      if (input[y + dy][x + dx] === "@") {
        count++;
      }
    }
  }
  return count;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let count = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "@") {
        let adjacent = countAdjacent(input, y, x);
        if (adjacent < 4) {
          count++;
        }
      }
    }
  }

  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let count = 0;
  let removedSomething = false;
  do {
    removedSomething = false;
    for (let y = 0; y < input.length; y++) {
      for (let x = 0; x < input[y].length; x++) {
        if (input[y][x] === "@") {
          let adjacent = countAdjacent(input, y, x);
          if (adjacent < 4) {
            count++;
            input[y][x] = ".";
            removedSomething = true;
          }
        }
      }
    }
  } while (removedSomething);

  return count;
};

const input = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

run({
  part1: {
    tests: [
      {
        input: input,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: 43,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
