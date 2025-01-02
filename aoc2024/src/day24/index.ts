import run from "aocrunner";

interface Gate {
  left: string;
  right: string;
  output: string;
  type: string;
  didOutput: boolean;
}

const parseInput = (rawInput: string) => {
  const [initialWiresStr, gatesStr] = rawInput.split("\n\n");

  const initialWires = initialWiresStr.split("\n").reduce((prev, curr) => {
    const [name, value] = curr.split(": ");

    prev[name] = value === "1";

    return prev;
  }, {} as Record<string, boolean>);

  const gates = gatesStr.split("\n").map<Gate>((line) => {
    const [leftWire, gateType, rightWire, _, outputWire] = line.split(" ");
    return {
      left: leftWire,
      output: outputWire,
      right: rightWire,
      type: gateType,
      didOutput: false,
    };
  });

  return { initialWires, gates };
};

const part1 = (rawInput: string) => {
  const { gates, initialWires } = parseInput(rawInput);

  const wires = { ...initialWires };

  let settled = true;
  do {
    settled = true;

    gates.forEach((g) => {
      if (g.didOutput) {
        return;
      }
      if (wires[g.left] != null && wires[g.right] != null) {
        if (g.type === "AND") {
          wires[g.output] = wires[g.left] && wires[g.right];
        } else if (g.type === "OR") {
          wires[g.output] = wires[g.left] || wires[g.right];
        } else if (g.type === "XOR") {
          wires[g.output] = wires[g.left] !== wires[g.right];
        }
        settled = false;
        g.didOutput = true;
      }
    });
  } while (!settled);

  let n = new Array(50).fill(0);

  Object.keys(wires)
    .filter((k) => k.startsWith("z"))
    .forEach((k) => {
      let i = parseInt(k.slice(1));
      n[i] = wires[k] ? 1 : 0;
    });

  return parseInt(n.reverse().join(""), 2);
};

const f = (s: string, i: number) => {
  return `${s}${i< 10 ? '0': ''}${i}`
}

const part2 = (rawInput: string) => {
  const { gates } = parseInput(rawInput);

  let wrong = new Set<string>();

  let prevCarry: string | null = null;

  const findGate = (in1: string, in2: string,  type: 'XOR' | 'AND' | 'OR') => {
    return gates.find((g) => ((g.left ===  in1 || g.right === in2)||(g.left === in2 || g.right===in1))&& g.type===type);
  }

  const swap = (out1: string, out2: string) => {
    wrong.add(out1);
    wrong.add(out2);
    const out1Gates = gates.filter((g) => g.output === out1)
    const out2Gates = gates.filter((g) => g.output === out2)
    out1Gates.forEach((g) => g.output = out2);
    out2Gates.forEach((g) => g.output = out1);
  }

  for (let i = 0; i < 45; i++) {
    const x = f('x', i);
    const y = f('y', i);
    const firstXOR = findGate(x,y,'XOR');
    const firstAND = findGate(x,y,'AND');

    if(i === 0) {
      prevCarry = firstAND.output;
      continue
    }

    let secondXOR = findGate(prevCarry, firstXOR.output, 'XOR');
    let secondAND = findGate(prevCarry, firstXOR.output, 'AND');
    
    if(!secondXOR.output.startsWith('z')){
      swap(f("z", i), secondXOR.output);
    }

    if (![firstXOR.output, prevCarry].includes(secondXOR.left) || ![firstXOR.output, prevCarry].includes(secondXOR.right)) {
        swap(firstXOR.output, firstAND.output);
    }
    prevCarry = findGate(secondAND.output, firstAND.output, 'OR').output;
  }

  return [...wrong].sort().join(",");
};

run({
  part1: {
    tests: [
      {
        input: `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`,
        expected: 2024,
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
