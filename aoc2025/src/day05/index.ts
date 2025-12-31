import run from "aocrunner";

const parseInput = (rawInput: string): [number[][], number[]] => {
  const [freshRanges, toCheckIds] = rawInput.split("\n\n");

  return [
    freshRanges.split("\n").map((l) => l.split("-").map((n) => parseInt(n))),
    toCheckIds.split("\n").map((n) => parseInt(n)),
  ];
};

const part1 = (rawInput: string) => {
  const [freshRanges, toCheckIds] = parseInput(rawInput);

  let freshCount = 0;

  toCheckIds.forEach((id) => {
    if (
      freshRanges.some((range) => {
        return id >= range[0] && id <= range[1];
      })
    ) {
      freshCount++;
    }
  });

  return freshCount;
};

const mergeOverlappingRanges = (ranges: number[][]) => {
  return ranges
    .sort((a, b) => a[0] - b[0])
    .reduce((prev, curr) => {
      if (prev.length === 0) {
        return [curr];
      }
      if (prev[prev.length - 1][1] >= curr[0]) {
        return [
          ...prev.slice(0, -1),
          [
            prev[prev.length - 1][0],
            Math.max(prev[prev.length - 1][1], curr[1]),
          ],
        ];
      }
      return [...prev, curr];
    }, [] as number[][]);
};

const part2 = (rawInput: string) => {
  const [freshRanges] = parseInput(rawInput);

  const mergedRanges = mergeOverlappingRanges(freshRanges);

  return mergedRanges.reduce((prev, curr) => prev + (curr[1] - curr[0] + 1), 0);
};

const input = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

run({
  part1: {
    tests: [
      {
        input: input,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: 14,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
