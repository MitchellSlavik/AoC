import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => BigInt(line));

const computeNext = (n: bigint) => {
  let a = ((n * 64n) ^ n) % 16777216n;
  //console.log("A: ", a);
  let b = ((a / 32n) ^ a) % 16777216n;
  //console.log("B: ", b);
  let c = ((b * 2048n) ^ b) % 16777216n;
  //console.log("C: ", c);
  return c;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return Number(
    input
      .map((n) => {
        let curr = n;
        for (let i = 0; i < (input.length === 1 ? 1 : 2000); i++) {
          curr = computeNext(curr);
        }
        return curr;
      })
      .reduce((prev, curr) => prev + curr, 0n)
  );
};

const makeKey = (a: number[]) => a.join("|");

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let max = 0;

  const changeMap: Record<string, number> = {};

  input.forEach((n) => {
    let curr = n;
    let changes = [];
    let seenKeys = new Set<string>();
    for (let i = 0; i < 2000; i++) {
      let next = computeNext(curr);
      let nextPrice = Number(next) % 10;
      let currPrice = Number(curr) % 10;

      if (changes.length === 4) {
        changes.shift();
        changes.push(nextPrice - currPrice);

        let key = makeKey(changes);
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          if (changeMap[key] != null) {
            changeMap[key] += nextPrice;
          } else {
            changeMap[key] = nextPrice;
          }
        }
      } else {
        changes.push(nextPrice - currPrice);
      }

      curr = next;
    }
  });

  Object.values(changeMap).forEach((n) => {
    if (n > max) {
      max = n;
    }
  });
  return max;
};

run({
  part1: {
    tests: [
      {
        input: `1
10
100
2024`,
        expected: 37327623,
      },
      {
        input: `123`,
        expected: 15887950,
      },
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
