import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split(",").map((l) => l.split("-").map((n) => parseInt(n)));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;

  input.forEach((l) => {
    for (let i = l[0]; i <= l[1]; i++) {
      let iStr = i.toString();
      if (iStr.length % 2 === 0) {
        let mid = iStr.length / 2;
        let left = iStr.substring(0, mid);
        let right = iStr.substring(mid);
        if (left === right) {
          sum += i;
        }
      }
    }
  });

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;

  input.forEach((l) => {
    for (let i = l[0]; i <= l[1]; i++) {
      let iStr = i.toString();
      for (let j = Math.floor(iStr.length / 2); j > 0; j--) {
        let left = iStr.substring(0, j);
        let repeated = left.repeat(Math.floor(iStr.length / j));
        if (repeated === iStr) {
          sum += i;
          break;
        }
      }
    }
  });

  return sum;
};

const input = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;

run({
  part1: {
    tests: [
      {
        input: input,
        expected: 1227775554,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: 4174379265,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
