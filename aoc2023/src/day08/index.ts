import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

interface Connection {
  loc: string;
  left: string;
  right: string;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const [directions, rest] = input.split("\n\n");

  let steps = 0;
  let curr = "AAA";

  const connections = rest.split("\n").map((line) => {
    const [label, conns] = line.split(" = ");
    return {
      label,
      left: conns.replace(new RegExp("(\\(|\\))", 'g'), "").split(", ")[0],
      right: conns.replace(new RegExp("(\\(|\\))", 'g'), "").split(", ")[1],
    }
  }).reduce((prev, curr) => ({
    ...prev,
    [curr.label]: curr
  }), {});

  while(curr!="ZZZ") {
    const dir = directions.charAt(steps%directions.length);
    if(dir === 'R') {
      curr = connections[curr].right;
    } else {
      curr = connections[curr].left;
    }
    steps++;
  }

  return steps;
};

const gcd = (a: number, b:number) =>  !b ? a : gcd(b, a % b);

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const [directions, rest] = input.split("\n\n");

  let curr: string[] = [];

  const connections: Record<string, Connection> = rest.split("\n").map((line) => {
    const [label, conns] = line.split(" = ");
    if(label.endsWith("A")) {
      curr.push(label);
    }
    return {
      label,
      left: conns.replace(new RegExp("(\\(|\\))", 'g'), "").split(", ")[0],
      right: conns.replace(new RegExp("(\\(|\\))", 'g'), "").split(", ")[1],
    }
  }).reduce((prev, curr) => ({
    ...prev,
    [curr.label]: curr
  }), {});

  return curr.map((c) => {
    let start = c;
    let steps = 0;

    while(!start.endsWith("Z")) {
      const dir = directions.charAt(steps%directions.length);
      const direction = dir === 'R' ? 'right' : 'left';
      start = connections[start][direction];
      steps++;
    }
    return steps;
  }).reduce((a, b) => lcm(a, b), 1);
};

const input = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`

const input2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`

run({
  part1: {
    tests: [
      {
        input,
        expected: 2,
      },
      {
        input: input2,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
