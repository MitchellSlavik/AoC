import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [towelsStr, patternsStr] = rawInput.split("\n\n");
  const towels = towelsStr.split(", ");
  const patterns = patternsStr.split("\n");

  return { towels, patterns };
};

let cache: Record<string, boolean> = {};

const canMakePattern = (
  towels: string[],
  pattern: string,
  workingIndex: number
) => {
  if (workingIndex >= pattern.length) {
    return true;
  }

  if (cache[pattern.slice(workingIndex)] != undefined) {
    return cache[pattern.slice(workingIndex)];
  }

  for (let i = 0; i < towels.length; i++) {
    if (
      pattern.slice(workingIndex, workingIndex + towels[i].length) === towels[i]
    ) {
      if (canMakePattern(towels, pattern, workingIndex + towels[i].length)) {
        cache[pattern.slice(workingIndex)] = true;
        return true;
      }
    }
  }

  cache[pattern.slice(workingIndex)] = false;
  return false;
};

const part1 = (rawInput: string) => {
  const { patterns, towels } = parseInput(rawInput);

  return patterns
    .map((p, i, a) => {
      cache = {};
      return canMakePattern(towels, p, 0) ? 1 : 0;
    })
    .reduce((prev, curr) => prev + curr, 0);
};

let waysCache: Record<string, number> = {};

const waysToMakePattern = (
  towels: string[],
  pattern: string,
  workingIndex: number
) => {
  if (waysCache[pattern.slice(workingIndex)] != undefined) {
    return waysCache[pattern.slice(workingIndex)];
  }

  let ways = 0;

  for (let i = 0; i < towels.length; i++) {
    if (pattern.slice(workingIndex) === towels[i]) {
      ways += 1;
    } else if (
      pattern.slice(workingIndex, workingIndex + towels[i].length) === towels[i]
    ) {
      ways += waysToMakePattern(
        towels,
        pattern,
        workingIndex + towels[i].length
      );
    }
  }

  waysCache[pattern.slice(workingIndex)] = ways;
  return ways;
};

const part2 = (rawInput: string) => {
  const { patterns, towels } = parseInput(rawInput);

  return patterns
    .map((p, i, a) => {
      waysCache = {};
      return waysToMakePattern(towels, p, 0);
    })
    .reduce((prev, curr) => prev + curr, 0);
};

run({
  part1: {
    tests: [
      {
        input: `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
        expected: 6,
      },
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
