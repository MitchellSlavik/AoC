import run from "aocrunner";

interface Area {
  width: number;
  height: number;
  counts: number[];
}

interface Present {
  grid: string[][];
}

const parseInput = (
  rawInput: string,
): { presents: Present[]; areas: Area[] } => {
  const sections = rawInput.split("\n\n");
  const presents = sections.slice(0, -1).map((section) => {
    return {
      grid: section
        .split("\n")
        .slice(1)
        .map((line) => line.split("")),
    };
  });
  const areas = sections[sections.length - 1].split("\n").map((line) => {
    const [dims, presentCounts] = line.split(": ");
    const [width, height] = dims.split("x").map(Number);
    const counts = presentCounts.split(" ").map(Number);
    return { width, height, counts };
  });
  return { presents, areas };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  //console.log(JSON.stringify(input, null, 2));

  let count = 0;
  input.areas.forEach((area) => {
    const areaSize = area.width * area.height;
    const spacesNeeded = area.counts.reduce((prev, curr) => prev + curr * 9, 0);
    if (areaSize >= spacesNeeded) {
      count++;
    }
  });
  return count;
};

const part2 = (rawInput: string) => {
  // no puzzle just clicked and got a star.

  return;
};

const input = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`;

run({
  part1: {
    tests: [
      {
        input: input,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
