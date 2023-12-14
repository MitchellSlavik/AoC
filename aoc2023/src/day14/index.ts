import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const rollRocksUp = (lines: string[]): [boolean, string[]] => {
  const newLines = [...lines];
  let movedSomething = false;

  for (let y = 0; y < newLines.length; y++) {
    for (let x = 0; x < newLines[y].length; x++) {
      if (newLines[y].charAt(x) === "O") {
        if (y > 0 && newLines[y - 1].charAt(x) === ".") {
          newLines[y - 1] =
            newLines[y - 1].substring(0, x) +
            "O" +
            newLines[y - 1].substring(x + 1);
          newLines[y] =
            newLines[y].substring(0, x) + "." + newLines[y].substring(x + 1);
          movedSomething = true;
        }
      }
    }
  }

  return [movedSomething, newLines];
};

const rollRocksDown = (lines: string[]): [boolean, string[]] => {
  const newLines = [...lines];
  let movedSomething = false;

  for (let y = 0; y < newLines.length; y++) {
    for (let x = 0; x < newLines[y].length; x++) {
      if (newLines[y].charAt(x) === "O") {
        if (y < newLines.length - 1 && newLines[y + 1].charAt(x) === ".") {
          newLines[y + 1] =
            newLines[y + 1].substring(0, x) +
            "O" +
            newLines[y + 1].substring(x + 1);
          newLines[y] =
            newLines[y].substring(0, x) + "." + newLines[y].substring(x + 1);
          movedSomething = true;
        }
      }
    }
  }

  return [movedSomething, newLines];
};

const rollRocksEast = (lines: string[]): [boolean, string[]] => {
  const newLines = [...lines];
  let movedSomething = false;

  for (let y = 0; y < newLines.length; y++) {
    for (let x = 0; x < newLines[y].length; x++) {
      if (newLines[y].charAt(x) === "O") {
        if (x < newLines[y].length - 1 && newLines[y].charAt(x + 1) === ".") {
          newLines[y] =
            newLines[y].substring(0, x) + ".O" + newLines[y].substring(x + 2);
          movedSomething = true;
        }
      }
    }
  }

  return [movedSomething, newLines];
};

const rollRocksWest = (lines: string[]): [boolean, string[]] => {
  const newLines = [...lines];
  let movedSomething = false;

  for (let y = 0; y < newLines.length; y++) {
    for (let x = 0; x < newLines[y].length; x++) {
      if (newLines[y].charAt(x) === "O") {
        if (x > 0 && newLines[y].charAt(x - 1) === ".") {
          newLines[y] =
            newLines[y].substring(0, x - 1) +
            "O." +
            newLines[y].substring(x + 1);
          movedSomething = true;
        }
      }
    }
  }

  return [movedSomething, newLines];
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let lines = input.split("\n");
  let movedSomething = false;

  [movedSomething, lines] = rollRocksUp(lines);

  while (movedSomething) {
    [movedSomething, lines] = rollRocksUp(lines);
  }

  return lines
    .map((line, index, arr) => {
      return (
        line.replace(new RegExp("(\\.|\\#)", "g"), "").length *
        (arr.length - index)
      );
    })
    .reduce((prev, curr) => prev + curr, 0);
};

const spin = (lines: string[]): string[] => {
  let newLines = [...lines];
  let movedSomething = false;

  do {
    [movedSomething, newLines] = rollRocksUp(newLines);
  } while (movedSomething);

  do {
    [movedSomething, newLines] = rollRocksWest(newLines);
  } while (movedSomething);

  do {
    [movedSomething, newLines] = rollRocksDown(newLines);
  } while (movedSomething);

  do {
    [movedSomething, newLines] = rollRocksEast(newLines);
  } while (movedSomething);

  return newLines;
};

const getKey = (lines: string[]) => {
  return lines
    .map((l) => {
      if (rowCache[l] !== undefined) {
        return rowCache[l];
      } else {
        rowCacheNum++;
        rowCache[l] = rowCacheNum;
        return rowCacheNum;
      }
    })
    .reduce((prev, curr) => `${prev}_${curr}`, "");
};

let rowCacheNum = 0;
let rowCache = {};
let cache = {};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let lines = input.split("\n");
  let i = 1;
  let a = 0;
  while (i <= 1000000000) {
    lines = spin(lines);
    let key = getKey(lines);
    if (cache[key] != null) {
      console.log("repeat", cache[key], i);
      //console.log(cache);
      a = cache[key];
      break;
    } else {
      cache[key] = i;
    }

    i++;
  }

  console.log(((1000000000 - a) % (i - a)) + a);
  let b = ((1000000000 - a) % (i - a)) + a;

  Object.keys(cache).forEach((k) => {
    if (cache[k] === b) {
      lines = k
        .substring(1)
        .split("_")
        .map((n) => Number(n))
        .map((n) => {
          const rowKeys = Object.keys(rowCache);
          for (let r = 0; r < rowKeys.length; r++) {
            if (rowCache[rowKeys[r]] === n) {
              return rowKeys[r];
            }
          }
          console.log("row not found!");
          return "";
        });
    }
  });

  return lines
    .map((line, index, arr) => {
      return (
        line.replace(new RegExp("(\\.|\\#)", "g"), "").length *
        (arr.length - index)
      );
    })
    .reduce((prev, curr) => prev + curr, 0);
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
