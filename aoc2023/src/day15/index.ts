import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const hash = (s: string) =>
  s
    .split("")
    .reduce((prev, curr) => ((prev + curr.charCodeAt(0)) * 17) % 256, 0);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .split(",")
    .map(hash)
    .reduce((prev, curr) => prev + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .split(",")
    .reduce((prev, curr) => {
      const s = curr.match(new RegExp("[a-z]+", "g"))[0];
      const h = hash(s);
      if (curr.includes("=")) {
        const i = prev[h].findIndex((e) => e[0] === s);
        const v = Number(curr.split("=")[1]);
        if (i >= 0) {
          prev[h][i][1] = v;
        } else {
          prev[h] = [...prev[h], [s, v]];
        }
      } else {
        prev[h] = prev[h].filter((e) => e[0] !== s);
      }
      return prev;
    }, new Array(256).fill([]) as Array<Array<[string, number]>>)
    .map(
      (v, index) =>
        (index + 1) * v.reduce((prev, curr, i) => prev + (i + 1) * curr[1], 0)
    )
    .reduce((prev, curr) => prev + curr, 0);
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
