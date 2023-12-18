import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

type Direction = "U" | "D" | "L" | "R";

interface Plan {
  direction: Direction;
  number: number;
}

const areaFromPlans = (plans: Plan[]): number => {
  const coords: [number, number][] = [];
  let currX = 0,
    currY = 0,
    acc = 0;

  plans.forEach(({ direction, number }) => {
    acc += number;
    switch (direction) {
      case "D":
        currY += number;
        break;
      case "U":
        currY -= number;
        break;
      case "L":
        currX -= number;
        break;
      case "R":
        currX += number;
        break;
    }
    coords.push([currX, currY]);
  });

  const shoelaceArea =
    Math.abs(
      coords.reduce((prev, curr, index, arr) => {
        let p2 = index === arr.length - 1 ? arr[0] : arr[index + 1];
        return prev + curr[0] * p2[1] - curr[1] * p2[0];
      }, 0)
    ) * 0.5;

  return shoelaceArea + acc * 0.5 + 1;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const plans = input.split("\n").map<Plan>((line) => {
    const [dir, numS, colorCode] = line.split(" ");

    return {
      direction: dir as Direction,
      number: Number(numS),
    };
  });

  return areaFromPlans(plans);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const plans = input.split("\n").map<Plan>((line) => {
    const [, , colorCode] = line.split(" ");
    let dir: Direction;
    switch (colorCode.charAt(7)) {
      case "0":
        dir = "R";
        break;
      case "1":
        dir = "D";
        break;
      case "2":
        dir = "L";
        break;
      case "3":
        dir = "U";
        break;
    }

    return {
      direction: dir,
      number: Number.parseInt("0x" + colorCode.substring(2, 7)),
    };
  });

  return areaFromPlans(plans);
};

const input = `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 62,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 952408144115,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
