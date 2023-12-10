import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

type Position = [number, number];

const posEqual = (p1: Position, p2: Position) => {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

const movePos = (grid: string[][], curr: Position, last: Position): Position => {
  const currChar = grid[curr[1]][curr[0]];
  switch(currChar) {
    case '|':
      if(last[1] === curr[1] + 1) {
        return [curr[0], curr[1]-1];
      } else {
        return [curr[0], curr[1]+1];
      }
    case '-':
      if(last[0] === curr[0] + 1) {
        return [curr[0]-1, curr[1]];
      } else {
        return [curr[0]+1, curr[1]];
      }
    case 'L':
      if(last[1] === curr[1] - 1) {
        return [curr[0]+1, curr[1]];
      } else {
        return [curr[0], curr[1]-1];
      }
    case '7':
      if(last[0] === curr[0] - 1) {
        return [curr[0], curr[1]+1];
      } else {
        return [curr[0]-1, curr[1]];
      }
    case 'J':
      if(last[0] === curr[0] - 1) {
        return [curr[0], curr[1]-1];
      } else {
        return [curr[0]-1, curr[1]];
      }
    case 'F':
      if(last[1] === curr[1] + 1) {
        return [curr[0]+1, curr[1]];
      } else {
        return [curr[0], curr[1]+1];
      }
    default:
      console.log("'"+currChar+"' found in loop");
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let startingPos: Position = [0,0]

  const grid = input.split("\n").map((line, index) => {
    if(line.includes("S")) {
      const x = line.indexOf("S");
      startingPos = [x, index];
    }

    return line.split("");
  });

  let lastPos1=startingPos, lastPos2 = startingPos;
  let pos1: Position = [startingPos[0], startingPos[1]-1];
  let pos2: Position = [startingPos[0], startingPos[1]+1];

  let steps = 1;

  while(!posEqual(pos1, pos2) && !posEqual(pos1, lastPos2) && !posEqual(pos2, lastPos1)) {
    let nextPos1 = movePos(grid, pos1, lastPos1);
    let nextPos2 = movePos(grid, pos2, lastPos2);
    lastPos1 = pos1;
    pos1 = nextPos1;
    lastPos2 = pos2;
    pos2 = nextPos2;
    steps++;
  }

  return steps;
};

const isEdge = (grid: string[][], y: number, x: number) => {
  if(y === 0 || x === 0) {
    return true;
  }
  if(grid.length-1 === y) {
    return true;
  }
  if(grid.length <= y || y < 0){
    return false;
  }
  return grid[y].length-1 === x;
}

const movePosP2 = (grid: string[][], curr: Position, last: Position): Position => {
  const currChar = grid[curr[1]][curr[0]];
  switch(currChar) {
    case '|':
      if(last[1] === curr[1] + 2) {
        grid[curr[1]-1][curr[0]] = '|';
        return [curr[0], curr[1]-2];
      } else {
        grid[curr[1]+1][curr[0]] = '|';
        return [curr[0], curr[1]+2];
      }
    case '-':
      if(last[0] === curr[0] + 2) {
        grid[curr[1]][curr[0]-1] = '-';
        return [curr[0]-2, curr[1]];
      } else {
        grid[curr[1]][curr[0]+1] = '-';
        return [curr[0]+2, curr[1]];
      }
    case 'L':
      if(last[1] === curr[1] - 2) {
        grid[curr[1]][curr[0]+1] = '-';
        return [curr[0]+2, curr[1]];
      } else {
        grid[curr[1]-1][curr[0]] = '|';
        return [curr[0], curr[1]-2];
      }
    case '7':
      if(last[0] === curr[0] - 2) {
        grid[curr[1]+1][curr[0]] = '|';
        return [curr[0], curr[1]+2];
      } else {
        grid[curr[1]][curr[0]-1] = '-';
        return [curr[0]-2, curr[1]];
      }
    case 'J':
      if(last[0] === curr[0] - 2) {
        grid[curr[1]-1][curr[0]] = '|';
        return [curr[0], curr[1]-2];
      } else {
        grid[curr[1]][curr[0]-1] = '-';
        return [curr[0]-2, curr[1]];
      }
    case 'F':
      if(last[1] === curr[1] + 2) {
        grid[curr[1]][curr[0]+1] = '-';
        return [curr[0]+2, curr[1]];
      } else {
        grid[curr[1]+1][curr[0]] = '|';
        return [curr[0], curr[1]+2];
      }
    default:
      console.log("'"+currChar+"' found in loop");
  }
}

const posEnclosed: Record<string, boolean> = {};

const formatPosition = (pos: Position) => `${pos[0]}:${pos[1]}`

const dirs = [[-1, 0], [0, -1], [1, 0], [0, 1]]

const checkIfEnclosed = (grid: string[][], y: number, x: number) => {
  const checked = new Set<string>();
  const toCheck: Position[] = [];

  for(let i = 0; i < dirs.length; i++) {
    let [a,b] = dirs[i];
    if(isEdge(grid, y+a, x+b)) {
      return false;
    } else {
      toCheck.push([x+b, y+a]);
      checked.add(formatPosition([x+b, y+a]));
    }
  }

  while(toCheck.length > 0) {
    const checking = toCheck.shift();

    if(posEnclosed[formatPosition(checking)] !== undefined){
      if(posEnclosed[formatPosition(checking)]) {
        continue;
      } else {
        return false;
      }
    }

    for(let i = 0; i < dirs.length; i++) {
      let [a,b] = dirs[i];
      if(checked.has(formatPosition([checking[0]+b,checking[1]+a]))){
        continue;
      }
      if(isEdge(grid, checking[1]+a, checking[0]+b)) {
        return false;
      } else {
        if(grid[checking[1]+a][checking[0]+b] === '*' || grid[checking[1]+a][checking[0]+b] === '.') {
          toCheck.push([checking[0]+b,checking[1]+a]);
          checked.add(formatPosition([checking[0]+b,checking[1]+a]))
        }
      }
    }
  }

  return true;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let startingPos: Position = [0,0]

  let grid = input.split("\n").map((line, index) => {
    if(line.includes("S")) {
      const x = line.indexOf("S");
      startingPos = [x*2+1, index*2+1];
    }

    return ["*", ...line.split("").join("*").split(""), "*"];
  });

  grid = grid.reduce((prev, curr) => {
    prev.push(new Array(curr.length).fill("*") as string[]);
    prev.push(curr);
    return prev;
  }, [] as string[][]);

  grid.push(new Array(grid[0].length).fill("*"))

  let lastPos1=startingPos;
  let pos1: Position = [startingPos[0], startingPos[1]-2];

  grid[startingPos[1]-1][startingPos[0]] = '|';

  while(!posEqual(pos1, startingPos)) {
    let nextPos1 = movePosP2(grid, pos1, lastPos1);
    lastPos1 = pos1;
    pos1 = nextPos1;
  }

  let enclosed = 0;

  for(let a = 1; a < grid.length - 1; a++) {
    if(a%2===0) continue;
    for(let b = 1; b < grid[a].length - 1; b++) {
      if(b%2===0) continue;
      if(grid[a][b] !== "*"){
        if(checkIfEnclosed(grid, a, b)) {
          posEnclosed[formatPosition([b, a])] = true;
          enclosed++;
        } else {
          posEnclosed[formatPosition([b, a])] = false;
        }
      }
    }
  }

  return enclosed;
};

const input = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`

run({
  part1: {
    tests: [
      // {
      //   input,
      //   expected: 8,
      //  },
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
