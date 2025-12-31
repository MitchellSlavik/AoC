import run from "aocrunner";

interface Connection {
  from: string;
  outputs: string[];
}

interface Path {
  path: string[];
  current: string;
}

const parseInput = (rawInput: string): Connection[] =>
  rawInput.split("\n").map((line) => {
    const [from, outputs] = line.split(":");
    return {
      from,
      outputs: outputs.trim().split(" "),
    };
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let count = 0;
  let current = [{ path: ["you"], current: "you" }];

  while (current.length > 0) {
    const currentPath = current.shift();
    const currentConnection = input.find((c) => c.from === currentPath.current);
    if (currentPath.current === "out") {
      count++;
      continue;
    }
    if (currentConnection) {
      current.push(
        ...currentConnection.outputs.map((output) => ({
          path: [...currentPath.path, output],
          current: output,
        })),
      );
    }
  }

  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // Build forward graph
  const forwardMap = new Map<string, string[]>();
  input.forEach((conn) => {
    forwardMap.set(conn.from, conn.outputs);
  });

  // Pre-compute reachability to "out"
  const canReachOut = new Set<string>();
  canReachOut.add("out");
  let changed = true;
  while (changed) {
    changed = false;
    forwardMap.forEach((outputs, from) => {
      if (!canReachOut.has(from)) {
        for (const output of outputs) {
          if (canReachOut.has(output)) {
            canReachOut.add(from);
            changed = true;
            break;
          }
        }
      }
    });
  }

  // Compute distances from "svr" using BFS (working forwards)
  const distanceFromSvr = new Map<string, number>();
  const queue: string[] = ["svr"];
  distanceFromSvr.set("svr", 0);

  while (queue.length > 0) {
    const node = queue.shift()!;
    const dist = distanceFromSvr.get(node)!;
    const successors = forwardMap.get(node) || [];

    for (const succ of successors) {
      if (!distanceFromSvr.has(succ) && canReachOut.has(succ)) {
        distanceFromSvr.set(succ, dist + 1);
        queue.push(succ);
      }
    }
  }

  // Make sure "out" is included if any reachable node points to it
  if (canReachOut.has("out") && !distanceFromSvr.has("out")) {
    // Find minimum distance to "out" by checking all nodes that point to it
    let minDist = Infinity;
    forwardMap.forEach((outputs, from) => {
      if (outputs.includes("out") && distanceFromSvr.has(from)) {
        minDist = Math.min(minDist, distanceFromSvr.get(from)! + 1);
      }
    });
    if (minDist !== Infinity) {
      distanceFromSvr.set("out", minDist);
    }
  }

  // Filter to only nodes reachable from "svr" (including "out" if it's reachable)
  const reachableFromSvr = new Set(distanceFromSvr.keys());

  // Also make sure "out" is in the DP if it's reachable
  if (canReachOut.has("out") && !reachableFromSvr.has("out")) {
    reachableFromSvr.add("out");
  }

  // DP: For each node, store 4 values: [hasDac=false,hasFft=false], [false,true], [true,false], [true,true]
  // dp[node][state] = number of paths from "svr" to node with that state
  type State = "00" | "01" | "10" | "11"; // [hasDac, hasFft]
  const dp = new Map<string, Map<State, number>>();

  // Initialize all nodes
  for (const node of reachableFromSvr) {
    const nodeDp = new Map<State, number>();
    nodeDp.set("00", 0);
    nodeDp.set("01", 0);
    nodeDp.set("10", 0);
    nodeDp.set("11", 0);
    dp.set(node, nodeDp);
  }

  // Base case: at "svr", we haven't visited dac or fft yet
  const svrDp = dp.get("svr")!;
  svrDp.set("00", 1); // Start with state "00" (neither visited)
  svrDp.set("01", 0);
  svrDp.set("10", 0);
  svrDp.set("11", 0);

  // Process all nodes iteratively until convergence
  // Process all nodes the same way, regardless of distance
  const allNodes = Array.from(reachableFromSvr).filter(
    (node) => node !== "svr",
  );

  let dpChanged = true;
  let iterations = 0;
  const maxIterations = allNodes.length * 2; // Safety limit

  while (dpChanged && iterations < maxIterations) {
    dpChanged = false;
    iterations++;

    // Process each node
    for (const node of allNodes) {
      const nodeDp = dp.get(node)!;

      // Check if this node is dac or fft
      const isDac = node === "dac";
      const isFft = node === "fft";

      // Store old counts to detect changes
      const oldCounts = new Map<State, number>();
      for (const state of ["00", "01", "10", "11"] as State[]) {
        oldCounts.set(state, nodeDp.get(state) || 0);
      }

      // Reset counts
      nodeDp.set("00", 0);
      nodeDp.set("01", 0);
      nodeDp.set("10", 0);
      nodeDp.set("11", 0);

      // Get predecessors (nodes that can reach this node)
      const predecessors: string[] = [];
      forwardMap.forEach((outputs, from) => {
        if (outputs.includes(node) && reachableFromSvr.has(from)) {
          predecessors.push(from);
        }
      });

      // Sum up paths from all predecessors
      for (const pred of predecessors) {
        const predDp = dp.get(pred);
        if (!predDp) continue;

        // For each state in the predecessor, update based on whether we visit dac/fft at current node
        for (const [predState, count] of predDp.entries()) {
          const [predHasDac, predHasFft] = [
            predState[0] === "1",
            predState[1] === "1",
          ];

          // If we visit dac/fft at current node, mark it as visited
          const newHasDac = isDac || predHasDac;
          const newHasFft = isFft || predHasFft;

          const newState: State = `${newHasDac ? "1" : "0"}${
            newHasFft ? "1" : "0"
          }` as State;
          nodeDp.set(newState, (nodeDp.get(newState) || 0) + count);
        }
      }

      // Check if counts changed
      for (const state of ["00", "01", "10", "11"] as State[]) {
        const newCount = nodeDp.get(state) || 0;
        if (newCount !== oldCounts.get(state)!) {
          dpChanged = true;
        }
      }
    }
  }

  // Get result from "out" - we want paths that have visited both dac and fft
  const outDp = dp.get("out");
  if (!outDp) {
    return 0;
  }

  const result = outDp.get("11") || 0;

  return result;
};

const input = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

const input2 = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

run({
  part1: {
    tests: [
      {
        input: input,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input2,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
