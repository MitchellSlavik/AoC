import run from "aocrunner";

let graph: Record<string, string[]> = {};
let cliques = new Set<string>();

const parseInput = (rawInput: string) => {
  let lines = rawInput.split("\n");
  let connections = lines.map((l) => l.split("-"));

  graph = {};
  cliques = new Set<string>();

  connections.forEach(([c1, c2]) => {
    if (graph[c1]) {
      graph[c1].push(c2);
    } else {
      graph[c1] = [c2];
    }
    if (graph[c2]) {
      graph[c2].push(c1);
    } else {
      graph[c2] = [c1];
    }
  });
};

const part1 = (rawInput: string) => {
  parseInput(rawInput);

  let connectionSets = new Set<string>();

  Object.keys(graph)
    .filter((k) => k.startsWith("t"))
    .forEach((key) => {
      let connections = graph[key];

      for (let i = 0; i < connections.length; i++) {
        let c1 = connections[i];
        for (let i2 = i + 1; i2 < connections.length; i2++) {
          let c2 = connections[i2];

          if (graph[c1].includes(c2)) {
            let connectionString = [key, c1, c2].sort().join(",");
            connectionSets.add(connectionString);
          }
        }
      }
    });

  return connectionSets.size;
};

const bronKerbosch = (r: string[], p: string[], x: string[]) => {
  if (p.length === 0 && x.length === 0) {
    cliques.add(r.sort().join(","));
    return;
  }
  for (let a = 0; a < p.length; a++) {
    let v = p[a];
    let p2 = p.slice(a);
    bronKerbosch(
      [...r, v],
      p2.filter((n) => graph[v].includes(n)),
      x.filter((n) => graph[v].includes(n))
    );
    x.push(v);
  }
};

const part2 = (rawInput: string) => {
  parseInput(rawInput);

  bronKerbosch([], Object.keys(graph), []);

  let maxClique = "";

  cliques.forEach((c) => {
    if (c.length > maxClique.length) {
      maxClique = c;
    }
  });

  return maxClique;
};

run({
  part1: {
    tests: [
      {
        input: `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`,
        expected: 7,
      },
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
