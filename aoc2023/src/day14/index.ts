import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const rollRocksNorth = (lines: string[]) => {
  for (let x = 0; x < lines[0].length; x++) {
    let movedSomething;
    do {
      movedSomething = false;
      for (let y = 0; y < lines.length; y++) {
        if (lines[y].charAt(x) === "O") {
          if (y > 0 && lines[y - 1].charAt(x) === ".") {
            lines[y - 1] =
              lines[y - 1].substring(0, x) +
              "O" +
              lines[y - 1].substring(x + 1);
            lines[y] =
              lines[y].substring(0, x) + "." + lines[y].substring(x + 1);
            movedSomething = true;
          }
        }
      }
    } while (movedSomething);
  }
};

const rollRocksSouth = (lines: string[]) => {
  for (let x = 0; x < lines[0].length; x++) {
    let movedSomething;
    do {
      movedSomething = false;
      for (let y = lines.length - 1; y >= 0; y--) {
        if (lines[y].charAt(x) === "O") {
          if (y < lines.length - 1 && lines[y + 1].charAt(x) === ".") {
            lines[y + 1] =
              lines[y + 1].substring(0, x) +
              "O" +
              lines[y + 1].substring(x + 1);
            lines[y] =
              lines[y].substring(0, x) + "." + lines[y].substring(x + 1);
            movedSomething = true;
          }
        }
      }
    } while (movedSomething);
  }
};

const rollRocksEast = (lines: string[]) => {
  for (let y = 0; y < lines.length; y++) {
    let movedSomething;
    do {
      movedSomething = false;
      for (let x = lines[y].length; x >= 0; x--) {
        if (lines[y].charAt(x) === "O") {
          if (x < lines[y].length - 1 && lines[y].charAt(x + 1) === ".") {
            lines[y] =
              lines[y].substring(0, x) + ".O" + lines[y].substring(x + 2);
            movedSomething = true;
          }
        }
      }
    } while (movedSomething);
  }
};

const rollRocksWest = (lines: string[]) => {
  for (let y = 0; y < lines.length; y++) {
    let movedSomething;
    do {
      movedSomething = false;
      for (let x = 0; x < lines[y].length; x++) {
        if (lines[y].charAt(x) === "O") {
          if (x > 0 && lines[y].charAt(x - 1) === ".") {
            lines[y] =
              lines[y].substring(0, x - 1) + "O." + lines[y].substring(x + 1);
            movedSomething = true;
          }
        }
      }
    } while (movedSomething);
  }
};

const calculateLoad = (lines: string[]) =>
  lines
    .map(
      (line, index, arr) =>
        line.replace(new RegExp("(\\.|\\#)", "g"), "").length *
        (arr.length - index)
    )
    .reduce((prev, curr) => prev + curr, 0);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let lines = input.split("\n");
  rollRocksNorth(lines);
  return calculateLoad(lines);
};

let cache = {};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let lines = input.split("\n");
  let iteration = 1;
  let startOfLoop = 0;
  while (iteration <= 1000000000) {
    rollRocksNorth(lines);
    rollRocksWest(lines);
    rollRocksSouth(lines);
    rollRocksEast(lines);
    let key = lines.join("_");
    if (cache[key] != null) {
      startOfLoop = cache[key];
      break;
    } else {
      cache[key] = iteration;
    }

    iteration++;
  }

  let iterationOfOneBillionthStep =
    ((1000000000 - startOfLoop) % (iteration - startOfLoop)) + startOfLoop;

  const keys = Object.keys(cache);
  for (let k = 0; k < keys.length; k++) {
    if (cache[keys[k]] === iterationOfOneBillionthStep) {
      return calculateLoad(keys[k].split("_"));
    }
  }
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
