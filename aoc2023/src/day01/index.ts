import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.toLowerCase();

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const sum = input.split("\n").map((line) => {
    const matches = [...line.matchAll(new RegExp("[0-9]", "g"))];
    return Number(matches[0][0] + matches[matches.length-1][0]);
  }).reduce((prev, curr) => prev + curr, 0);

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const reverse = (text: string) => {
    if(text.length < 2){
      return text;
    }
    return text.split("").reverse().join("");
  }

  const reg = new RegExp("([0-9]|one|two|three|four|five|six|seven|eight|nine)", "g");
  const reversedReg = new RegExp("([0-9]|"+reverse("one|two|three|four|five|six|seven|eight|nine") + ")", "g");

  const getDigit = (text: string) => {
    switch(text) {
      case 'one':
        return '1';
      case 'two':
        return '2';
      case 'three':
        return '3';
      case 'four':
        return '4';
      case 'five':
        return '5';
      case 'six':
        return '6';
      case 'seven':
        return '7';
      case 'eight':
        return '8';
      case 'nine':
        return '9';
      default:
        return text;
    }
  }

  const sum = input.split("\n").map((line) => {
    return Number(getDigit(line.match(reg)[0]) + getDigit(reverse(reverse(line).match(reversedReg)[0])));
  }).reduce((prev, curr) => prev + curr, 0);

  return sum;
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
      {
        input: `one4five`,
        expected: 15,
      },
      {
        input: `one4zero\ntwo45`,
        expected: 39,
      },
      {
        input: `two1nine
                eightwothree
                abcone2threexyz
                xtwone3four
                4nineeightseven2
                zoneight234
                7pqrstsixteen
                2oneight`,
        expected: 309
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
