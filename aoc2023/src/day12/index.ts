import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

let cache = {};

const cacheCombinations = (s: string, numArr: number[]) => {
  let key = s + numArr.join(",");
  if (cache[key] !== undefined) {
    return cache[key];
  }
  cache[key] = findCombinations(s, numArr);
  return cache[key];
};

const findCombinations = (s: string, numArr: number[]) => {
  if (numArr.length === 0) {
    if (s.replace(new RegExp("(\\.|\\?)", "g"), "").length === 0) {
      return 1;
    }
  } else if (s.match(new RegExp(`^(\\#|\\?){${numArr[0]}}`))) {
    const afterMatch = s.substring(numArr[0]);
    if (afterMatch.startsWith("?") || afterMatch.startsWith(".")) {
      return (
        cacheCombinations(afterMatch.substring(1), numArr.slice(1)) +
        (s.startsWith("#") ? 0 : cacheCombinations(s.substring(1), numArr))
      );
    } else if (afterMatch.startsWith("#")) {
      return s.startsWith("#") ? 0 : cacheCombinations(s.substring(1), numArr);
    } else if (afterMatch.length === 0 && numArr.length === 1) {
      return 1;
    }
  } else if (s.startsWith(".")) {
    return cacheCombinations(s.replace(new RegExp("^\\.+", "g"), ""), numArr);
  } else if (s.startsWith("?")) {
    return cacheCombinations(s.replace(new RegExp("^\\?+", "g"), ""), numArr);
  }
  return 0;
};

const part1 = (rawInput: string) => {
  return parseInput(rawInput)
    .map((line) => {
      const [rest, groups] = line.split(" ");
      cache = {};
      return findCombinations(
        rest,
        groups.split(",").map((s) => Number(s))
      );
    })
    .reduce((prev, curr) => prev + curr, 0);
};

const part2 = (rawInput: string) => {
  return parseInput(rawInput)
    .map((line) => {
      const [rest, groups] = line.split(" ");
      cache = {};
      return findCombinations(
        new Array(5).fill(rest).join("?"),
        new Array(5)
          .fill(groups)
          .join(",")
          .split(",")
          .map((s) => Number(s))
      );
    })
    .reduce((prev, curr) => prev + curr, 0);
};

const input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
