import run from "aocrunner";

const lookForResult = (
  numbers: number[],
  current: number,
  result: number,
  concat: boolean = false,
): boolean => {
  let a = numbers[0];
  let mult = 1;
  while (a >= 1 && concat) {
    a /= 10;
    mult *= 10;
  }
  if (numbers.length === 1) {
    return (
      current + numbers[0] === result ||
      current * numbers[0] === result ||
      (concat && current * mult + numbers[0] === result)
    );
  } else {
    const removed = numbers.slice(1);

    return (
      lookForResult(removed, current + numbers[0], result, concat) ||
      lookForResult(removed, current * numbers[0], result, concat) ||
      (concat &&
        lookForResult(removed, current * mult + numbers[0], result, concat))
    );
  }
};

const nRegex = /\:? /g;

const solution = (concat: boolean) => (rawInput: string) => {
  return rawInput
    .split("\n")
    .map((line) => {
      const [result, firstN, ...rest] = line
        .split(nRegex)
        .map((n) => parseInt(n));
      return lookForResult(rest, firstN, result, concat) ? result : 0;
    })
    .reduce((prev, curr) => prev + curr, 0);
};

const input = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 3749,
      },
    ],
    solution: solution(false),
  },
  part2: {
    tests: [
      {
        input,
        expected: 11387,
      },
    ],
    solution: solution(true),
  },
  trimTestInputs: true,
  onlyTests: false,
});
