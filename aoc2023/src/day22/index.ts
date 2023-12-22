import run from "aocrunner";

const parseInput = (rawInput: string): Brick[] =>
  rawInput.split("\n").map((line, index) => {
    const [minX, minY, minZ, maxX, maxY, maxZ] = line
      .split(new RegExp(",|~", "g"))
      .map(Number);
    return {
      id: `${index}`,
      maxX,
      maxY,
      maxZ,
      minX,
      minY,
      minZ,
    };
  });

interface Brick {
  id: string;
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

const getBricksBelow = (bricks: Brick[], brick: Brick): Brick[] => {
  return bricks.filter(
    (tb) =>
      tb.maxZ === brick.minZ - 1 &&
      tb.minX <= brick.maxX &&
      brick.minX <= tb.maxX &&
      tb.minY <= brick.maxY &&
      brick.minY <= tb.maxY
  );
};

const getBricksAbove = (bricks: Brick[], brick: Brick): Brick[] => {
  return bricks.filter(
    (tb) =>
      tb.minZ - 1 === brick.maxZ &&
      tb.minX <= brick.maxX &&
      brick.minX <= tb.maxX &&
      tb.minY <= brick.maxY &&
      brick.minY <= tb.maxY
  );
};

const settleBricks = (bricks: Brick[]) => {
  bricks = bricks.sort((a, b) => a.minZ - b.minZ);

  let movedSomething = false;

  do {
    movedSomething = false;
    bricks.forEach((brick, _, arr) => {
      while (true) {
        const bricksBelow = getBricksBelow(arr, brick);
        if (bricksBelow.length === 0 && brick.minZ > 1) {
          brick.minZ -= 1;
          brick.maxZ -= 1;
          movedSomething = true;
        } else {
          break;
        }
      }
    });
  } while (movedSomething);

  return bricks;
};

const part1 = (rawInput: string) =>
  settleBricks(parseInput(rawInput))
    .map(
      (brick, _, bricks) =>
        !getBricksAbove(bricks, brick).some(
          (b) => getBricksBelow(bricks, b).length === 1
        )
    )
    .reduce((prev, curr) => prev + Number(curr), 0);

const part2 = (rawInput: string) => {
  return settleBricks(parseInput(rawInput))
    .map((brick, _, bricks) => {
      const bricksBroken = [brick];
      const bricksToProcess = getBricksAbove(bricks, brick);
      while (bricksToProcess.length) {
        let pb = bricksToProcess.shift();

        if (
          !bricksBroken.includes(pb) &&
          getBricksBelow(bricks, pb).filter((b) => !bricksBroken.includes(b))
            .length === 0
        ) {
          bricksBroken.push(pb);
          bricksToProcess.push(...getBricksAbove(bricks, pb));
        }
      }
      return bricksBroken.length - 1;
    })
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
