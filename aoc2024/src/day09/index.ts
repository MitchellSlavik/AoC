import run from "aocrunner";

const parseInput = (rawInput: string): number[][] =>
  rawInput
    .split("")
    .map((numStr, i) =>
      new Array(parseInt(numStr)).fill(i % 2 === 0 ? Math.floor(i / 2) : -1),
    );

const nextFree = (disk: number[][], lastA: number, lastB: number) => {
  let a = lastA,
    b = lastB;
  while (disk[a][b] !== -1) {
    if (b < disk[a].length - 1) {
      b++;
    } else {
      a++;
      b = 0;
    }
  }
  return [a, b];
};

const compress = (disk: number[][]) => {
  let [lastFreeA, lastFreeB] = nextFree(disk, 0, 0);
  for (let a = disk.length - 1; a >= 0; a--) {
    for (let b = disk[a].length - 1; b >= 0; b--) {
      if (lastFreeA >= a && lastFreeB >= b) {
        return disk;
      }
      if (disk[a][b] === -1) {
        continue;
      }
      disk[lastFreeA][lastFreeB] = disk[a][b];
      disk[a][b] = -1;
      [lastFreeA, lastFreeB] = nextFree(disk, lastFreeA, lastFreeB);
    }
  }
  return disk;
};

const findFree = (disk: number[][], size: number): [number, boolean] => {
  let a = 0;
  while (a < disk.length) {
    if (disk[a][0] !== -1 || disk[a].length < size) {
      a++;
      continue;
    }

    if (disk[a].length === size) {
      return [a, false];
    }

    if (disk[a].length > size) {
      const currSize = disk[a].length;
      disk.splice(
        a,
        1,
        new Array(size).fill(-1),
        new Array(currSize - size).fill(-1),
      );
      return [a, true];
    }
  }
  return [-1, false];
};

const compress2 = (disk: number[][]) => {
  for (let a = disk.length - 1; a >= 0; a--) {
    if (disk[a][0] === -1) {
      continue;
    }
    const size = disk[a].length;
    const [toA, spliced] = findFree(disk, size);

    if (toA === -1 || toA >= a) {
      continue;
    }

    const newA = a + (spliced ? 1 : 0);

    const temp = disk[toA];
    disk[toA] = disk[newA];
    disk[newA] = temp;

    if (spliced) {
      a++;
    }
  }
  return disk;
};

const checksum = (disk: number[][]) => {
  let sum = 0;
  let pos = 0;
  for (let a = 0; a < disk.length; a++) {
    for (let b = 0; b < disk[a].length; b++) {
      if (disk[a][b] !== -1) {
        sum += pos * disk[a][b];
      }
      pos++;
    }
  }

  return sum;
};

const part1 = (rawInput: string) => {
  return checksum(compress(parseInput(rawInput)));
};

const part2 = (rawInput: string) => {
  return checksum(compress2(parseInput(rawInput)));
};

run({
  part1: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 1928,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
