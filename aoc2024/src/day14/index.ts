import run from "aocrunner";

interface Robot {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map<Robot>((line) => {
    let [position, velocity] = line.split(" ");
    let positionParts = position.split("=")[1].split(",");
    let velocityParts = velocity.split("=")[1].split(",");
    return {
      x: parseInt(positionParts[0]),
      y: parseInt(positionParts[1]),
      vx: parseInt(velocityParts[0]),
      vy: parseInt(velocityParts[1]),
    };
  });

const iterateRobot = (r: Robot, height: number, width: number) => {
  r.x += r.vx;
  r.y += r.vy;

  if (r.x < 0) {
    r.x = width + r.x;
  }

  if (r.y < 0) {
    r.y = height + r.y;
  }

  if (r.x >= width) {
    r.x -= width;
  }

  if (r.y >= height) {
    r.y -= height;
  }
};

const calcDangerLevel = (robots: Robot[], height: number, width: number) => {
  return (
    robots.filter((r) => r.x < (width - 2) / 2 && r.y < (height - 2) / 2)
      .length *
    robots.filter((r) => r.x < (width - 2) / 2 && r.y > height / 2).length *
    robots.filter((r) => r.x > width / 2 && r.y > height / 2).length *
    robots.filter((r) => r.x > width / 2 && r.y < (height - 2) / 2).length
  );
};

const part1 = (rawInput: string) => {
  const robots = parseInput(rawInput);

  const width = robots.length < 30 ? 11 : 101;
  const height = robots.length < 30 ? 7 : 103;

  for (let s = 0; s < 100; s++) {
    robots.forEach((r) => iterateRobot(r, height, width));
  }

  return calcDangerLevel(robots, height, width);
};

const part2 = (rawInput: string) => {
  const robots = parseInput(rawInput);

  const width = robots.length < 30 ? 11 : 101;
  const height = robots.length < 30 ? 7 : 103;

  let i = 0;
  let dangerLevel = 0;
  let totalDanger = 0;

  while (i < 100000) {
    robots.forEach((r) => iterateRobot(r, height, width));
    i++;

    dangerLevel = calcDangerLevel(robots, height, width);
    totalDanger += dangerLevel;

    if (Math.abs(totalDanger / i - dangerLevel) > 100000000) {
      for (let y = 0; y < height; y++) {
        let line = "";
        for (let x = 0; x < width; x++) {
          line += robots.some((r) => r.x === x && r.y === y) ? "X" : ".";
        }
        if (line.includes("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")) {
          return i;
        }
      }
    }
  }

  return 0;
};

run({
  part1: {
    tests: [
      {
        input: `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
        expected: 12,
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
