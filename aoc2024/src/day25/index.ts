import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const sections = rawInput.split("\n\n").map((sec) => sec.split("\n"));

  const keys: number[][] = [];
  const locks: number[][] = [];

  sections.forEach((s) =>  {
    let key = [];
    for(let x= 0; x < s[0].length; x++){
      let count = 0;
      for(let y = 0; y < s.length; y ++) {
        if(s[y][x] === '#'){
          count++;
        }
      }
      key.push(count);
    }
    if(s[0][0]  ===  '.'){
      keys.push(key);
    }else {
      locks.push(key);
    }
  })

  return { keys, locks }
};

const part1 = (rawInput: string) => {
  const {keys, locks} = parseInput(rawInput);

  return keys.map((k) => {
    return locks.filter((l) => {
      return k.every((v, i) => v + l[i] <= 7)
    }).length
  }).reduce((prev, curr) => prev + curr, 0)
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
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
