import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const toKey = (v: [number, number]) => v.join(",");
const fromKey = (k: string) => k.split(",").map(Number) as [number, number];

const neighbors: [number, number][] = [
  [0, 1],
  [0, -1],
  [-1, 0],
  [1, 0],
];

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const grid = input.split("\n");

  const startX = 1;
  const startY = 0;
  const targetY = grid.length - 1;
  const targetX = grid[targetY].length - 2;

  const distances: Record<string, number> = {};
  const queue: [number, number][][] = [[[startX, startY]]];

  while (queue.length) {
    const curr = queue.shift();

    const [currX, currY] = curr[curr.length - 1];

    if ((distances[toKey([currX, currY])] ?? -Infinity) >= curr.length - 1) {
      continue;
    }

    distances[toKey([currX, currY])] = curr.length - 1;

    let acceptableNeighbors = neighbors;

    if (grid[currY][currX].match(new RegExp("\\<|\\>|v|\\^", "g"))) {
      switch (grid[currY][currX]) {
        case "v":
          acceptableNeighbors = [[0, 1]];
          break;
        case ">":
          acceptableNeighbors = [[1, 0]];
          break;
        case "<":
          acceptableNeighbors = [[-1, 0]];
          break;
        case "^":
          acceptableNeighbors = [[0, -1]];
          break;
      }
    }

    for (let i = 0; i < acceptableNeighbors.length; i++) {
      const [nextX, nextY] = [
        currX + acceptableNeighbors[i][0],
        currY + acceptableNeighbors[i][1],
      ];

      if (
        nextX >= 0 &&
        nextX < grid[0].length &&
        nextY >= 0 &&
        nextY < grid.length
      ) {
        if (
          grid[nextY][nextX] === "#" ||
          curr.some((p) => p[0] === nextX && p[1] === nextY)
        ) {
          continue;
        }
        queue.push([...curr, [nextX, nextY]]);
      }
    }
  }

  return distances[toKey([targetX, targetY])];
};

const runDFS = (
  target: [number, number],
  mappedHallways: Record<string, [[number, number], number][]>
) => {
  let best = 0;

  const dfs = (curr: [number, number], path: Set<string>, distance: number) => {
    if (curr[0] === target[0] && curr[1] === target[1]) {
      if (distance > best) {
        best = distance;
      }
    }
    if (mappedHallways[toKey(curr)]) {
      for (let [p, d] of mappedHallways[toKey(curr)]) {
        if (!path.has(toKey(p))) {
          path.add(toKey(p));
          dfs(p, path, distance + d);
          path.delete(toKey(p));
        }
      }
    }
  };

  dfs([1, 0], new Set(), 0);

  return best;
};

const adjacent = (grid: string[], [currX, currY]: [number, number]) => {
  const adj: [number, number][] = [];
  for (let i = 0; i < neighbors.length; i++) {
    const [x, y] = [currX + neighbors[i][0], currY + neighbors[i][1]];

    if (
      x >= 0 &&
      x < grid[0].length &&
      y >= 0 &&
      y < grid.length &&
      grid[y][x] !== "#"
    ) {
      adj.push([x, y]);
    }
  }
  return adj;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const grid = input.split("\n");

  const startX = 1;
  const startY = 0;
  const targetY = grid.length - 1;
  const targetX = grid[targetY].length - 2;

  const verts = new Set<string>();

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== "#") {
        const countAdjacent = adjacent(grid, [x, y]).length;
        if (countAdjacent > 2) {
          verts.add(toKey([x, y]));
        }
      }
    }
  }

  verts.add(toKey([startX, startY]));
  verts.add(toKey([targetX, targetY]));

  const mappedHallways: Record<string, [[number, number], number][]> = {};

  for (let key of verts) {
    let queue = [fromKey(key)];
    let seen = new Set<string>();
    seen.add(key);
    let dist = 0;
    while (queue.length) {
      let nextQueue: [number, number][] = [];
      dist += 1;
      for (let curr of queue) {
        for (let adj of adjacent(grid, curr)) {
          const adjKey = toKey(adj);
          if (!seen.has(adjKey)) {
            if (verts.has(adjKey)) {
              mappedHallways[key] = [
                ...(mappedHallways[key] ?? []),
                [adj, dist],
              ];
            } else {
              nextQueue.push(adj);
            }
            seen.add(adjKey);
          }
        }
      }
      queue = nextQueue;
    }
  }

  return runDFS([targetX, targetY], mappedHallways);
};

const input = `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 94,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 154,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
