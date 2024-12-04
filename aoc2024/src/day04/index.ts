import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const charAt = (input: string[], x: number, y: number) => {
  if (x >= 0 && x < input[0].length) {
    if (y >= 0 && y < input.length) {
      return input[y].charAt(x);
    }
  }
  return null;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let xmas = 0;

  for (let x = 0; x < input[0].length; x++) {
    for (let y = 0; y < input.length; y++) {
      const curr = charAt(input, x, y);
      if (curr === "X") {
        for (let dirX = -1; dirX < 2; dirX++) {
          for (let dirY = -1; dirY < 2; dirY++) {
            if (dirX === 0 && dirY === 0) {
              continue;
            }
            if (
              charAt(input, x + dirX, y + dirY) === "M" &&
              charAt(input, x + dirX * 2, y + dirY * 2) === "A" &&
              charAt(input, x + dirX * 3, y + dirY * 3) === "S"
            ) {
              xmas++;
            }
          }
        }
      }
    }
  }

  return xmas;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let xmas = 0;

  for (let x = 0; x < input[0].length; x++) {
    for (let y = 0; y < input.length; y++) {
      const curr = charAt(input, x, y);
      if (curr === "A") {
        if (
          (charAt(input, x - 1, y - 1) === "M" &&
            charAt(input, x + 1, y + 1) === "S") ||
          (charAt(input, x - 1, y - 1) === "S" &&
            charAt(input, x + 1, y + 1) === "M")
        ) {
          if (
            (charAt(input, x - 1, y + 1) === "M" &&
              charAt(input, x + 1, y - 1) === "S") ||
            (charAt(input, x - 1, y + 1) === "S" &&
              charAt(input, x + 1, y - 1) === "M")
          ) {
            xmas++;
          }
        }
      }
    }
  }

  return xmas;
};

run({
  part1: {
    tests: [
      {
        input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 9,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
