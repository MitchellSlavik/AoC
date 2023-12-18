import run from "aocrunner";

const parseInput = (rawInput: string): Graph => {
  const grid = rawInput.split("\n").map((line) => {
    return line.split("").map((n) => Number(n));
  });
  return {
    grid,
    height: grid.length,
    width: grid[0].length,
    start: { x: 0, y: 0 },
    end: { x: grid[0].length - 1, y: grid.length - 1 },
  };
};

interface Point {
  x: number;
  y: number;
}

const getKey = (p: PointWithDirection) => `${p.x},${p.y},${p.dir},${p.count}`;
const pointEq = (p1: Point, p2: Point) => p1.x === p2.x && p1.y === p2.y;

interface PointWithDirection extends Point {
  dir: number;
  count: number;
}

interface Graph {
  grid: number[][];
  height: number;
  width: number;
  start: Point;
  end: Point;
}

const neighbors: Point[] = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
];

const getNeighbors = (
  graph: Graph,
  p: PointWithDirection,
  min: number,
  max: number
): PointWithDirection[] => {
  const neighboringPoints: PointWithDirection[] = [];
  for (let n = 0; n < neighbors.length; n++) {
    const count = 1 + (n === p.dir ? p.count : 0);
    const newPoint: PointWithDirection = {
      x: p.x + neighbors[n].x,
      y: p.y + neighbors[n].y,
      count,
      dir: n,
    };
    if (
      newPoint.y >= 0 &&
      newPoint.y < graph.height &&
      newPoint.x >= 0 &&
      newPoint.x < graph.width
    ) {
      const reverse = (p.dir + 2) % 4 === n;
      const tooLong = count > max;
      const tooShort = p.dir !== n && p.dir !== 4 && p.count < min;
      if (!reverse && !tooLong && !tooShort) {
        neighboringPoints.push(newPoint);
      }
    }
  }
  return neighboringPoints;
};

const aStar = (
  graph: Graph,
  min: number,
  max: number,
  test: (graph: Graph, p: PointWithDirection) => boolean
): [
  Record<string, number>,
  Record<string, PointWithDirection>,
  PointWithDirection
] => {
  const cameFrom: Record<string, PointWithDirection> = {};
  const gScore: Record<string, number> = {};
  const visited: Record<string, boolean> = {};
  const start: PointWithDirection = { x: 0, y: 0, dir: 4, count: 0 };
  gScore[getKey(start)] = 0;

  let openSet: [PointWithDirection, number][] = [[start, 0]];

  while (!(openSet.length === 0)) {
    openSet = openSet.sort((a, b) => a[1] - b[1]);

    let [curr] = openSet.shift();

    if (visited[getKey(curr)]) {
      continue;
    }

    visited[getKey(curr)] = true;

    if (test(graph, curr)) {
      return [gScore, cameFrom, curr];
    }

    getNeighbors(graph, curr, min, max).forEach((n) => {
      let tentGScore = gScore[getKey(curr)] + graph.grid[n.y][n.x];
      if (gScore[getKey(n)] == null || tentGScore < gScore[getKey(n)]) {
        cameFrom[getKey(n)] = curr;
        gScore[getKey(n)] = tentGScore;

        openSet.push([n, tentGScore + 0]);
      }
    });
  }

  return [gScore, cameFrom, { count: 0, dir: 0, x: -1, y: -1 }];
};

const printPath = (
  graph: Graph,
  prev: Record<string, PointWithDirection>,
  end: PointWithDirection
) => {
  const gridCopy = graph.grid.map((row) => row.map((n) => `${n}`));
  gridCopy[graph.height - 1][graph.width - 1] = "*";
  let curr = prev[getKey(end)];
  while (curr) {
    gridCopy[curr.y][curr.x] = "*";
    curr = prev[getKey(curr)];
  }
  gridCopy.forEach((row) => console.log(row.join("")));
};

const part1 = (rawInput: string) => {
  const graph = parseInput(rawInput);

  const [scores, prev, lastPoint] = aStar(graph, 0, 3, (g, p) =>
    pointEq(p, g.end)
  );

  printPath(graph, prev, lastPoint);

  return scores[getKey(lastPoint)];
};

const part2 = (rawInput: string) => {
  const graph = parseInput(rawInput);

  const [scores, prev, lastPoint] = aStar(
    graph,
    4,
    10,
    (g, p) => pointEq(p, g.end) && p.count > 3
  );

  printPath(graph, prev, lastPoint);

  return scores[getKey(lastPoint)];
};

const input = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const input2 = `
111111111111
999999999991
999999999991
999999999991
999999999991`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 102,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: 94,
      },
      {
        input: input2,
        expected: 71,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
