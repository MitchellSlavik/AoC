import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const getDifferences = (nums: number[]) => {
  const diffs = nums.map((n, i, arr) => {
    if(i === arr.length - 1) return 0;
    return arr[i+1] - n;
  })
  diffs.pop();
  return diffs;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.split("\n").map((line) => {
    const numbers = [line.split(" ").map((n) => Number(n))];

    while(numbers[numbers.length-1].some(n => n !== 0)) {
      numbers.push(getDifferences(numbers[numbers.length-1]));
    }

    for(let i = numbers.length-1; i > 0; i--) {
      numbers[i-1].push(numbers[i][numbers[i].length-1] + numbers[i-1][numbers[i-1].length-1]);
    }

    return numbers[0][numbers[0].length-1];
  }).reduce((prev, curr) => prev + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.split("\n").map((line) => {
    const numbers = [line.split(" ").map((n) => Number(n))];

    while(numbers[numbers.length-1].some(n => n !== 0)) {
      numbers.push(getDifferences(numbers[numbers.length-1]));
    }

    for(let i = numbers.length-1; i > 0; i--) {
      numbers[i-1].unshift(numbers[i-1][0] - numbers[i][0]);
    }

    return numbers[0][0];
  }).reduce((prev, curr) => prev + curr, 0);
};

const input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`

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
      {
        input,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
