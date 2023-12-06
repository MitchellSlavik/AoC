import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const [time, distance] = input.split("\n").map((line) => {
    return line.split(":")[1].split(" ").filter((s) => s.length > 0).map(s => Number(s))
  });

  return time.map((t, i) => {
    let wins = 0;
    let hold = 0, go = 0;
    if(t % 2 === 1) {
      hold = (t - 1) / 2;
      go = (t + 1) / 2;
    } else {
      hold = go = t / 2;
    }
    while(hold > 0) {
      if(hold*go > distance[i]) {
        wins += hold === go ? 1 : 2;
      } else {
        break;
      }

      hold--;
      go++;
    }
    return wins;
  }).reduce((prev, curr) => prev * curr, 1)
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const [t, distance] = input.split("\n").map((line) => {
    return Number(line.split(":")[1].replace(new RegExp(" ", "g"), ""))
  });

  let wins = 0;
  let hold = 0, go = 0;
  if(t % 2 === 1) {
    hold = (t - 1) / 2;
    go = (t + 1) / 2;
  }
  let mag = 10000000;
  while(hold > 0) {
    if(hold*go > distance && (hold-mag) * (go+mag) > distance) {
      wins += 2 * mag;
      hold-=mag;
      go+=mag;
    } else {
      if (mag === 1) {
        wins += hold*go > distance ? 2 : 0;
        break;
      } else {
        mag /= 10;
      }
    }
  }
  return wins;
};

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 288,
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
