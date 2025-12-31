import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(",").map(Number));

const getArea = (point1: number[], point2: number[]) => {
  return (
    Math.abs(point1[0] - point2[0] + 1) * Math.abs(point1[1] - point2[1] + 1)
  );
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let maxArea = 0;

  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const area = getArea(input[i], input[j]);
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }

  return maxArea;
};

type LineSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const isBetweenInclusive = (value: number, n1: number, n2: number) => {
  return value >= Math.min(n1, n2) && value <= Math.max(n1, n2);
};

const isBetween = (value: number, n1: number, n2: number) => {
  return value > Math.min(n1, n2) && value < Math.max(n1, n2);
};

const doSegmentsIntersect = (segment1: LineSegment, segment2: LineSegment) => {
  // check if the segments are parallel
  if (segment1.x1 === segment1.x2 && segment2.x1 === segment2.x2) {
    return false;
  }
  if (segment1.y1 === segment1.y2 && segment2.y1 === segment2.y2) {
    return false;
  }

  // check if the segments intersect
  if (segment1.x1 === segment1.x2) {
    //segment1 is vertical so segment2 must be horizontal
    if (isBetween(segment2.y1, segment1.y1, segment1.y2)) {
      if (isBetween(segment1.x1, segment2.x1, segment2.x2)) {
        return true;
      }
    }
    return false;
  }
  if (segment1.y1 === segment1.y2) {
    //segment1 is horizontal so segment2 must be vertical
    if (
      isBetween(segment2.x1, segment1.x1, segment1.x2) &&
      isBetween(segment1.y1, segment2.y1, segment2.y2)
    ) {
      return true;
    }
  }
  return false;
};

const doesAreaContainPoint = (
  areaP1: number[],
  areaP2: number[],
  point: number[],
) => {
  if (point[0] === areaP1[0] && point[1] === areaP1[1]) {
    return false;
  }
  if (point[0] === areaP2[0] && point[1] === areaP2[1]) {
    return false;
  }
  if (point[0] === areaP1[0] && point[1] === areaP2[1]) {
    return false;
  }
  if (point[0] === areaP2[0] && point[1] === areaP1[1]) {
    return false;
  }
  return (
    isBetweenInclusive(point[0], areaP1[0], areaP2[0]) &&
    isBetweenInclusive(point[1], areaP1[1], areaP2[1])
  );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let maxArea = 0;

  const lineSegments: LineSegment[] = [];
  for (let i = 0; i < input.length; i++) {
    let j = i + 1 === input.length ? 0 : i + 1;
    lineSegments.push({
      x1: input[i][0],
      y1: input[i][1],
      x2: input[j][0],
      y2: input[j][1],
    });
  }

  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const areaP1 = input[i];
      const areaP2 = input[j];
      let contains = false;
      for (let k = 0; k < input.length; k++) {
        if (k !== i && k !== j) {
          if (doesAreaContainPoint(areaP1, areaP2, input[k])) {
            contains = true;
            break;
          }
        }
      }
      let segmentsIntersect = false;
      let segments = [];
      segments.push({
        x1: areaP1[0],
        y1: areaP1[1],
        x2: areaP1[0],
        y2: areaP2[1],
      });
      segments.push({
        x1: areaP2[0],
        y1: areaP2[1],
        x2: areaP2[0],
        y2: areaP1[1],
      });
      segments.push({
        x1: areaP1[0],
        y1: areaP1[1],
        x2: areaP2[0],
        y2: areaP1[1],
      });
      segments.push({
        x1: areaP2[0],
        y1: areaP2[1],
        x2: areaP1[0],
        y2: areaP2[1],
      });
      for (let k = 0; k < lineSegments.length; k++) {
        for (let l = 0; l < segments.length; l++) {
          if (doSegmentsIntersect(segments[l], lineSegments[k])) {
            segmentsIntersect = true;
            break;
          }
        }
        if (segmentsIntersect) {
          break;
        }
      }
      if (!contains && !segmentsIntersect) {
        const area = getArea(areaP1, areaP2);
        if (area > maxArea) {
          maxArea = area;
        }
      }
    }
  }
  return maxArea;
};

const checkOverlap = (area: Area, lineSegment: LineSegment) => {
  return (
    Math.max(area.x1, area.x2) > Math.min(lineSegment.x1, lineSegment.x2) &&
    Math.min(area.x1, area.x2) < Math.max(lineSegment.x1, lineSegment.x2) &&
    Math.max(area.y1, area.y2) > Math.min(lineSegment.y1, lineSegment.y2) &&
    Math.min(area.y1, area.y2) < Math.max(lineSegment.y1, lineSegment.y2)
  );
};

type Area = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  area: number;
};

const part2New = (rawInput: string) => {
  const input = parseInput(rawInput);
  const areas: Area[] = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const area = getArea(input[i], input[j]);
      areas.push({
        x1: input[i][0],
        y1: input[i][1],
        x2: input[j][0],
        y2: input[j][1],
        area: area,
      });
    }
  }

  areas.sort((a, b) => b.area - a.area);

  const lineSegments: LineSegment[] = [];
  for (let i = 0; i < input.length; i++) {
    let j = i === input.length - 1 ? 0 : i + 1;
    lineSegments.push({
      x1: input[i][0],
      y1: input[i][1],
      x2: input[j][0],
      y2: input[j][1],
    });
  }

  return (
    areas.find((area) =>
      lineSegments.every((lineSegment) => !checkOverlap(area, lineSegment)),
    )?.area ?? 0
  );
};

const input = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

run({
  part1: {
    tests: [
      {
        input: input,
        expected: 50,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: 24,
      },
    ],
    solution: part2New,
  },
  trimTestInputs: true,
  onlyTests: false,
});
