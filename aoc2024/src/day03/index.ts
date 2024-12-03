import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.matchAll(/mul\((\d{1,3})\,(\d{1,3})\)/g);

const parseInput2 = (rawInput: string) =>
  rawInput.matchAll(/mul\((\d{1,3})\,(\d{1,3})\)|do\(\)|don\'t\(\)/g);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let sum = 0;
  let curr = input.next();
  while (!curr.done) {
    sum += parseInt(curr.value[1]) * parseInt(curr.value[2]);
    curr = input.next();
  }
  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput2(rawInput);
  let sum = 0;
  let enabled = true;
  let curr = input.next();
  while (!curr.done) {
    if (curr.value[0] === "do()") {
      enabled = true;
    } else if (curr.value[0] === "don't()") {
      enabled = false;
    } else if (enabled) {
      sum += parseInt(curr.value[1]) * parseInt(curr.value[2]);
    }
    curr = input.next();
  }
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
        expected: 161,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
        expected: 48,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
