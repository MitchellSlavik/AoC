import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const findMirrorLine = (lines: string[]): number => {
  let mirrorLine = 0;
  for (let a = 0; a < lines.length - 1; a++) {
    if (lines[a] === lines[a + 1]) {
      let mirrored = true;
      for (let b = 1; b <= a; b++) {
        if (lines.length <= a + b + 1) {
          break;
        }
        if (lines[a - b] !== lines[a + b + 1]) {
          mirrored = false;
        }
      }
      if (mirrored) {
        mirrorLine = a + 1;
        break;
      }
    }
  }
  return mirrorLine;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .split("\n\n")
    .map((pattern) => {
      const lines = pattern.split("\n");

      let horizontalLine = findMirrorLine(lines);
      let verticalLine = findMirrorLine(
        lines[0].split("").map((_, i) =>
          new Array(lines.length)
            .fill(0)
            .map((_, i2) => lines[i2].charAt(i))
            .join("")
        )
      );

      return horizontalLine * 100 + verticalLine;
    })
    .reduce((prev, curr) => prev + curr, 0);
};

const strDiff = (s1: string, s2: string) => {
  if (s1 === s2) {
    return 0;
  }
  if (s1.length !== s2.length) {
    console.log("cant compare diff lengths");
    return -1;
  }
  let differences = 0;
  for (let a = 0; a < s1.length; a++) {
    if (s1.charAt(a) !== s2.charAt(a)) {
      differences++;
    }
  }
  return differences;
};

const findSmudgedMirrorLine = (lines: string[]): number => {
  let mirrorLine = 0;
  for (let a = 0; a < lines.length - 1; a++) {
    if (lines[a] === lines[a + 1]) {
      let mirrored = true;
      let smudged = false;
      for (let b = 1; b <= a; b++) {
        if (lines.length <= a + b + 1) {
          break;
        }
        if (lines[a - b] !== lines[a + b + 1]) {
          if (strDiff(lines[a - b], lines[a + b + 1]) === 1 && !smudged) {
            smudged = true;
          } else {
            mirrored = false;
          }
        }
      }
      if (mirrored && smudged) {
        mirrorLine = a + 1;
        break;
      }
    } else if (strDiff(lines[a], lines[a + 1]) === 1) {
      let mirrored = true;
      for (let b = 1; b <= a; b++) {
        if (lines.length <= a + b + 1) {
          break;
        }
        if (lines[a - b] !== lines[a + b + 1]) {
          mirrored = false;
        }
      }
      if (mirrored) {
        mirrorLine = a + 1;
        break;
      }
    }
  }
  return mirrorLine;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .split("\n\n")
    .map((pattern) => {
      const lines = pattern.split("\n");

      let horizontalLine = findSmudgedMirrorLine(lines);
      let verticalLine = findSmudgedMirrorLine(
        lines[0].split("").map((_, i) =>
          new Array(lines.length)
            .fill(0)
            .map((_, i2) => lines[i2].charAt(i))
            .join("")
        )
      );

      return horizontalLine * 100 + verticalLine;
    })
    .reduce((prev, curr) => prev + curr, 0);
};

const input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 400,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
