import run from "aocrunner";
import { arrayBuffer } from "stream/consumers";

const parseInput = (rawInput: string) => rawInput;

type Position = [number, number];

const distance = (pos1: Position, pos2: Position) => {
  return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let grid: string[] =  input.split("\n");

  for(let a = 0; a < grid.length; a++) {
    if(grid[a].replace(new RegExp("\\.", "g"), "").length === 0) {
      grid = [...grid.slice(0, a), ".".repeat(grid[a].length), ...grid.slice(a)]
      a++; // skip the newly added line
    }
  }

  for(let a = 0; a < grid[0].length; a++) {
    if(!grid.some((l) => l.charAt(a) === '#')) {
      for(let i = 0; i < grid.length; i++) {
        grid[i] = grid[i].substring(0, a) + "." + grid[i].substring(a);
      }
      a++;
    }
  }

  const galaxyPositions: Position[] = [];

  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {
      if(grid[y].charAt(x) === '#') {
        galaxyPositions.push([x, y]);
      }
    }
  }

  // console.log("galaxies found: ", galaxyPositions.length, grid);

  return galaxyPositions.map((pos, index, arr) => {
    let sum = 0;

    for(let i = index + 1; i < arr.length; i++) {
      // console.log(index+1, " -> ", i+1, " : ", distance(pos, arr[i]), pos, arr[i])
      sum += distance(pos, arr[i]);
    }

    return sum;
  }).reduce((prev, curr) => prev + curr, 0);
};

const mult = 999999;

const distanceP2 = (grid: string[], pos1: Position, pos2: Position) => {
  let distance = 0;
  let min = [Math.min(pos1[0], pos2[0]), Math.min(pos1[1], pos2[1])];
  let max = [Math.max(pos1[0], pos2[0]), Math.max(pos1[1], pos2[1])];

  for(let a = min[0]+1; a <= max[0]; a++) {
    if(grid[min[1]].charAt(a) === 'X') {
      distance += mult;
    } else {
      distance++;
    }
  }

  for(let a = min[1] + 1; a <= max[1]; a++) {
    if(grid[a].charAt(min[0]) === 'X') {
      distance += mult;
    } else {
      distance++;
    }
  }

  return distance;
}


const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let grid: string[] =  input.split("\n");

  for(let a = 0; a < grid.length; a++) {
    if(grid[a].replace(new RegExp("\\.", "g"), "").length === 0) {
      grid = [...grid.slice(0, a), "X".repeat(grid[a].length), ...grid.slice(a)]
      a++; // skip the newly added line
    }
  }

  for(let a = 0; a < grid[0].length; a++) {
    if(!grid.some((l) => l.charAt(a) === '#')) {
      for(let i = 0; i < grid.length; i++) {
        grid[i] = grid[i].substring(0, a) + "X" + grid[i].substring(a);
      }
      a++;
    }
  }

  const galaxyPositions: Position[] = [];

  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {
      if(grid[y].charAt(x) === '#') {
        galaxyPositions.push([x, y]);
      }
    }
  }

  // console.log("galaxies found: ", galaxyPositions.length, grid);

  return galaxyPositions.map((pos, index, arr) => {
    let sum = 0;

    for(let i = index + 1; i < arr.length; i++) {
      if(index > 3)
      // console.log(index+1, " -> ", i+1, " : ", distanceP2(grid, pos, arr[i]), pos, arr[i])
      sum += distanceP2(grid, pos, arr[i]);
    }

    return sum;
  }).reduce((prev, curr) => prev + curr, 0);
};

const input = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 1030,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
