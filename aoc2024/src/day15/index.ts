import run from "aocrunner";

interface Direction {
  dx: number;
  dy: number;
}

interface Box {
  leftX: number;
  y: number;
}

const LEFT: Direction = { dx: -1, dy: 0 };
const RIGHT: Direction = { dx: 1, dy: 0 };
const UP: Direction = { dx: 0, dy: -1 };
const DOWN: Direction = { dx: 0, dy: 1 };

const parseInput = (rawInput: string, p2: boolean = false) => {
  const [mapLines, commandLines] = rawInput.split("\n\n");
  const commands = commandLines
    .split("\n")
    .join("")
    .split("")
    .map((c) => {
      switch (c) {
        case "<":
          return LEFT;
        case ">":
          return RIGHT;
        case "^":
          return UP;
        case "v":
          return DOWN;
        default:
          console.log("What? " + c);
      }
    });

  const map = mapLines.split("\n").map((line) =>
    line
      .split("")
      .map((c) => {
        if (!p2) return c;
        switch (c) {
          case "#":
            return "##";
          case "O":
            return "[]";
          case ".":
            return "..";
          case "@":
            return "@.";
        }
      })
      .join("")
      .split(""),
  );

  let startX = 0,
    startY = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "@") {
        startX = x;
        startY = y;
      }
    }
  }
  map[startY][startX] = ".";
  return { map, startX, startY, commands };
};

const nextEmptySpace = (
  map: string[][],
  currX: number,
  currY: number,
  direction: Direction,
) => {
  const nextSpot = map[currY + direction.dy][currX + direction.dx];
  if (nextSpot === ".") {
    return { x: currX + direction.dx, y: currY + direction.dy };
  } else if (nextSpot === "#") {
    return null;
  }
  return nextEmptySpace(
    map,
    currX + direction.dx,
    currY + direction.dy,
    direction,
  );
};

const part1 = (rawInput: string) => {
  const { commands, map, startX, startY } = parseInput(rawInput);

  let currX = startX;
  let currY = startY;

  commands.forEach((d) => {
    const next = nextEmptySpace(map, currX, currY, d);

    if (!next) {
      return;
    }
    if (next.x !== currX + d.dx || next.y !== currY + d.dy) {
      map[next.y][next.x] = "O";
      map[currY + d.dy][currX + d.dx] = ".";
    }
    currX += d.dx;
    currY += d.dy;
  });

  return map.reduce(
    (prev, line, y) =>
      prev + line.reduce((p, c, x) => (c === "O" ? p + y * 100 + x : p), 0),
    0,
  );
};

const canMoveBox = (
  map: string[][],
  boxLeftX: number,
  y: number,
  direction: Direction,
  boxes: Box[],
) => {
  boxes.push({ leftX: boxLeftX, y });
  const movingToLeft = map[y + direction.dy][boxLeftX];
  const movingToRight = map[y + direction.dy][boxLeftX + 1];
  if (movingToLeft === "#" || movingToRight === "#") {
    return false;
  }
  if (movingToLeft === "." && movingToRight === ".") {
    return true;
  }
  if (movingToLeft === "[") {
    return canMoveBox(map, boxLeftX, y + direction.dy, direction, boxes);
  }
  let canMoveLeftBox = true;
  let canMoveRightBox = true;
  if (movingToLeft === "]") {
    canMoveLeftBox = canMoveBox(
      map,
      boxLeftX - 1,
      y + direction.dy,
      direction,
      boxes,
    );
  }
  if (movingToRight === "[") {
    canMoveRightBox = canMoveBox(
      map,
      boxLeftX + 1,
      y + direction.dy,
      direction,
      boxes,
    );
  }
  return canMoveLeftBox && canMoveRightBox;
};

const part2 = (rawInput: string) => {
  const { commands, map, startX, startY } = parseInput(rawInput, true);

  let currX = startX;
  let currY = startY;

  commands.forEach((d) => {
    if (d.dy === 0) {
      const next = nextEmptySpace(map, currX, currY, d);

      if (!next) {
        return;
      }
      if (next.x !== currX + d.dx || next.y !== currY + d.dy) {
        let shiftingX = currX + d.dx;
        let lastC = ".";
        while (shiftingX != next.x) {
          let c = map[currY][shiftingX];
          map[currY][shiftingX] = lastC;
          lastC = c;
          shiftingX += d.dx;
        }
        map[currY][next.x] = lastC;
      }
      currX += d.dx;
      currY += d.dy;
    } else {
      const nextSpotC = map[currY + d.dy][currX];
      if (nextSpotC === "#") {
        return;
      } else if (nextSpotC === ".") {
        currX += d.dx;
        currY += d.dy;
      } else if (nextSpotC === "[" || nextSpotC === "]") {
        let boxes: Box[] = [];
        if (
          canMoveBox(
            map,
            nextSpotC === "[" ? currX : currX - 1,
            currY + d.dy,
            d,
            boxes,
          )
        ) {
          boxes
            .sort((a, b) => (d.dy === 1 ? b.y - a.y : a.y - b.y))
            .forEach((b) => {
              map[b.y + d.dy][b.leftX] = "[";
              map[b.y + d.dy][b.leftX + 1] = "]";
              map[b.y][b.leftX] = ".";
              map[b.y][b.leftX + 1] = ".";
            });
          currX += d.dx;
          currY += d.dy;
        }
      }
    }
  });

  return map.reduce(
    (prev, line, y) =>
      prev +
      line.reduce((p, c, x) => {
        if (c === "[") {
          return p + y * 100 + x;
        }
        return p;
      }, 0),
    0,
  );
};

const input = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

const input2 = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`;

const input3 = `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 10092,
      },
      {
        input: input2,
        expected: 2028,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 9021,
      },
      // {
      //   input: input3,
      //   expected: 0,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
