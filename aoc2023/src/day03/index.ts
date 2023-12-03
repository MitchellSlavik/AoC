import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;

  input.split("\n").map((line, index, arr) => {
    const matches = [...line.matchAll(new RegExp("[0-9]+", "g"))];

    matches.forEach((numMatch) => {
      const matchIndex = numMatch.index;
      const matchLength = numMatch[0].length;
      if(index !== 0 && arr[index-1].substring(Math.max(0, matchIndex-1), matchIndex + matchLength + 1).replace(new RegExp("([0-9]|\\.)", "g"), "").length > 0) {
        sum += Number(numMatch[0]);
        return;
      }
      if(index !== arr.length - 1 && arr[index+1].substring(Math.max(0, matchIndex-1), matchIndex + matchLength + 1).replace(new RegExp("([0-9]|\\.)", "g"), "").length > 0) {
        sum += Number(numMatch[0]);
        return;
      }
      if(matchIndex !== 0 && line.charAt(matchIndex-1) !== ".") {
        sum += Number(numMatch[0]);
        return;
      }
      if(matchIndex + matchLength < line.length && line.charAt(matchIndex + matchLength) !== ".") {
        sum += Number(numMatch[0]);
        return;
      }
    })
  })

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const cogs = {};

  const addNumToCog = (id: string, num: number) => {
    if(cogs[id]) {
      cogs[id].push(num);
    } else {
      cogs[id] = [num];
    }
  }

  input.split("\n").map((line, index, arr) => {
    const matches = [...line.matchAll(new RegExp("[0-9]+", "g"))];

    matches.forEach((numMatch) => {
      const matchIndex = numMatch.index;
      const matchLength = numMatch[0].length;
      if(index !== 0) {
        [...arr[index-1].substring(Math.max(0, matchIndex-1), matchIndex + matchLength + 1).matchAll(new RegExp("\\*", "g"))].forEach((cogMatch) => {
          addNumToCog(`${index-1}-${matchIndex-1+cogMatch.index}`, Number(numMatch[0]));
        })
      }
      if(index !== arr.length - 1) {
        [...arr[index+1].substring(Math.max(0, matchIndex-1), matchIndex + matchLength + 1).matchAll(new RegExp("\\*", "g"))].forEach((cogMatch) => {
          addNumToCog(`${index+1}-${matchIndex-1+cogMatch.index}`, Number(numMatch[0]));
        })
      }
      if(matchIndex !== 0 && line.charAt(matchIndex-1) === "*") {
        addNumToCog(`${index}-${matchIndex-1}`, Number(numMatch[0]));
      }
      if(matchIndex + matchLength < line.length && line.charAt(matchIndex + matchLength) === "*") {
        addNumToCog(`${index}-${matchIndex + matchLength}`, Number(numMatch[0]));
      }
    })
  })

  return Object.keys(cogs).map((key) => cogs[key]).filter((arr) => arr.length === 2).reduce((prev, curr) => prev + (curr[0] * curr[1]), 0)
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
