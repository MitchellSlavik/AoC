import run from "aocrunner";

type Edge = [string, string];

interface Node {
  id: string;
  count: number;
}

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const edges = input
    .split("\n")
    .map<Edge[]>((line) => {
      const [source, targets] = line.split(": ");
      return targets
        .split(" ")
        .map((t) => [source, t].sort() as [string, string]);
    })
    .reduce((prev, curr) => prev.concat(curr), []);

  let nodeSet: string[] = [];

  edges.forEach(([n1, n2]) => {
    if (!nodeSet.includes(n1)) {
      nodeSet.push(n1);
    }
    if (!nodeSet.includes(n2)) {
      nodeSet.push(n2);
    }
  });

  while (true) {
    let nodes: Node[] = nodeSet.map((id) => ({ id, count: 1 }));
    let edgesCopy: Edge[] = JSON.parse(JSON.stringify(edges));

    while (nodes.length > 2) {
      const selectedEdge =
        edgesCopy[Math.floor(Math.random() * edgesCopy.length)];
      const node1Index = nodes.findIndex((n) => n.id === selectedEdge[0]);
      const node2Index = nodes.findIndex((n) => n.id === selectedEdge[1]);

      if (node1Index < 0 || node2Index < 0) {
        console.log("Node not found???");
      }

      const node1 = nodes[node1Index];
      const node2 = nodes[node2Index];

      // collapse into a single node
      node1.count += node2.count;
      nodes.splice(node2Index, 1);

      edgesCopy.forEach((edge) => {
        if (edge[0] === node2.id) {
          edge[0] = node1.id;
        }
        if (edge[1] === node2.id) {
          edge[1] = node1.id;
        }
      });

      edgesCopy = edgesCopy.filter((e) => e[0] !== e[1]);
    }

    if (edgesCopy.length === 3) {
      return nodes.reduce((prev, curr) => prev * curr.count, 1);
    }
  }
};

const part2 = (rawInput: string) => {
  return 0;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
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
