import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.split("\n").map((line) => {
    const [cardNum, rest] = line.split(":");
    const [winning, mine] = rest.split("|");
    const winningNumbers = winning.split(" ").filter((s) => s.length > 0).map((s) => Number(s));
    const myNumbers = mine.split(" ").filter((s) => s.length > 0).map((s) => Number(s));
    const matches = myNumbers.filter((n) => winningNumbers.includes(n)).length;
    
    if(matches > 0) {
      return Math.pow(2, matches-1);
    }
    return 0;
  }).reduce((prev, curr) => prev + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.split("\n").map((line) => {
    const [cardNum, rest] = line.split(":");
    return {
      numCards: 1,
      line: rest
    }
  }).map(({numCards, line}, index, arr) => {
    const [winning, mine] = line.split("|");
    const winningNumbers = winning.split(" ").filter((s) => s.length > 0).map((s) => Number(s));
    const myNumbers = mine.split(" ").filter((s) => s.length > 0).map((s) => Number(s));
    const matches = myNumbers.filter((n) => winningNumbers.includes(n)).length;
    
    if(matches > 0) {
      for (let i = 1; i <= matches; i++) {
        arr[index + i].numCards = arr[index+i].numCards + numCards;
      }
    }
    return numCards;
  }).reduce((prev, curr) => prev + curr, 0);
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
