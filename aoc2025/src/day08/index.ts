import run from "aocrunner";

interface JunctionBox {
  id: number;
  x: number;
  y: number;
  z: number;
}

interface Distance {
  box1: number;
  box2: number;
  distance: number;
}

interface Circuit {
  boxes: Set<number>;
}

const parseInput = (rawInput: string): JunctionBox[] =>
  rawInput.split("\n").map((line, id) => {
    const [x, y, z] = line.split(",").map(Number);
    return {
      id,
      x,
      y,
      z,
    };
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let distances: Distance[] = [];

  for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const box1 = input[i];
      const box2 = input[j];
      const distance = Math.sqrt(
        Math.pow(box1.x - box2.x, 2) +
          Math.pow(box1.y - box2.y, 2) +
          Math.pow(box1.z - box2.z, 2),
      );
      distances.push({ box1: box1.id, box2: box2.id, distance });
    }
  }

  distances.sort((a, b) => a.distance - b.distance);

  let circuits: Circuit[] = [];

  let numConnections = input.length < 30 ? 10 : 1000;

  for (let i = 0; i < numConnections; i++) {
    const distance = distances[i];
    const circuitsThatHaveOneOfTheBoxes = circuits.filter(
      (c) => c.boxes.has(distance.box1) || c.boxes.has(distance.box2),
    );
    if (circuitsThatHaveOneOfTheBoxes.length === 0) {
      circuits.push({ boxes: new Set([distance.box1, distance.box2]) });
    } else if (circuitsThatHaveOneOfTheBoxes.length === 1) {
      const circuit = circuitsThatHaveOneOfTheBoxes[0];
      circuit.boxes.add(distance.box1);
      circuit.boxes.add(distance.box2);
    } else {
      circuits = circuits.filter(
        (c) => !circuitsThatHaveOneOfTheBoxes.includes(c),
      );
      circuits.push({
        boxes: new Set([
          distance.box1,
          distance.box2,
          ...circuitsThatHaveOneOfTheBoxes.flatMap((c) => Array.from(c.boxes)),
        ]),
      });
    }
  }

  circuits.sort((a, b) => b.boxes.size - a.boxes.size);

  return (
    circuits[0].boxes.size * circuits[1].boxes.size * circuits[2].boxes.size
  );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let distances: Distance[] = [];

  for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const box1 = input[i];
      const box2 = input[j];
      const distance = Math.sqrt(
        Math.pow(box1.x - box2.x, 2) +
          Math.pow(box1.y - box2.y, 2) +
          Math.pow(box1.z - box2.z, 2),
      );
      distances.push({ box1: box1.id, box2: box2.id, distance });
    }
  }

  distances.sort((a, b) => a.distance - b.distance);

  let circuits: Circuit[] = [];

  let lastConnection: Distance | null = null;

  do {
    const distance = distances.shift();
    if (!distance) {
      console.log("We ran out of distances");
      break;
    }
    lastConnection = distance;
    const circuitsThatHaveOneOfTheBoxes = circuits.filter(
      (c) => c.boxes.has(distance.box1) || c.boxes.has(distance.box2),
    );
    if (circuitsThatHaveOneOfTheBoxes.length === 0) {
      circuits.push({ boxes: new Set([distance.box1, distance.box2]) });
    } else if (circuitsThatHaveOneOfTheBoxes.length === 1) {
      const circuit = circuitsThatHaveOneOfTheBoxes[0];
      circuit.boxes.add(distance.box1);
      circuit.boxes.add(distance.box2);
    } else {
      circuits = circuits.filter(
        (c) => !circuitsThatHaveOneOfTheBoxes.includes(c),
      );
      circuits.push({
        boxes: new Set([
          distance.box1,
          distance.box2,
          ...circuitsThatHaveOneOfTheBoxes.flatMap((c) => Array.from(c.boxes)),
        ]),
      });
    }
  } while (circuits[0].boxes.size !== input.length);

  if (lastConnection) {
    let box1 = input.find((b) => b.id === lastConnection.box1);
    let box2 = input.find((b) => b.id === lastConnection.box2);
    if (box1 && box2) {
      return box1.x * box2.x;
    }
  }
  return "No last connection";
};

const input = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

run({
  part1: {
    tests: [
      {
        input: input,
        expected: 40,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: 25272,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
