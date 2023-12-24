import run from "aocrunner";

import { init } from "z3-solver";

interface Hail {
  px: number;
  py: number;
  pz: number;
  vx: number;
  vy: number;
  vz: number;
}

const MIN_AREA = 200000000000000;
const MAX_AREA = 400000000000000;

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map<Hail>((line) => {
    const [p, v] = line.split("@").map((v) => v.trim());
    const [px, py, pz] = p.split(", ").map(Number);
    const [vx, vy, vz] = v.split(", ").map(Number);
    return {
      px,
      py,
      pz,
      vx,
      vy,
      vz,
    };
  });

const part1 = (rawInput: string) => {
  const hail = parseInput(rawInput);

  return hail
    .map((hail, index, arr) => {
      let sum = 0;

      // y = mx + b
      // m = vy / vx
      // b = y - mx
      // intersection happens where both ys and xs are the same
      // m1x + b1 = m2x + b2
      // m1x - m2x = b2 - b1
      // x*(m1-m2) = b2 - b1
      // x = (b2-b1)/(m1-m2)

      const m = hail.vy / hail.vx;
      const b = hail.py - m * hail.px;

      for (let i = index + 1; i < arr.length; i++) {
        const hail2 = arr[i];
        const m2 = hail2.vy / hail2.vx;
        const b2 = hail2.py - m2 * hail2.px;

        // parallel check
        if (m !== m2) {
          const x = (b2 - b) / (m - m2);
          const y = m * x + b;

          if (
            (x - hail.px) / hail.vx > 0 &&
            (x - hail2.px) / hail2.vx > 0 &&
            x >= MIN_AREA &&
            x <= MAX_AREA &&
            y >= MIN_AREA &&
            y <= MAX_AREA
          ) {
            sum++;
          }
        }
      }

      return sum;
    })
    .reduce((prev, curr) => prev + curr, 0);
};

const part2 = async (rawInput: string) => {
  const hail = parseInput(rawInput);

  const { Context } = await init();
  const { Solver, Int, Eq, Real, isRealVal } = Context("main");

  const x = Real.const("x"),
    y = Real.const("y"),
    z = Real.const("z");
  const vx = Real.const("vx"),
    vy = Real.const("vy"),
    vz = Real.const("vz");

  const solver = new Solver();

  hail.forEach((h, i) => {
    const t = Real.const(`t_${i}`);

    solver.add(t.ge(0));
    solver.add(Eq(x.add(t.mul(vx)), t.mul(h.vx).add(h.px)));
    solver.add(Eq(y.add(t.mul(vy)), t.mul(h.vy).add(h.py)));
    solver.add(Eq(z.add(t.mul(vz)), t.mul(h.vz).add(h.pz)));
  });

  const res = await solver.check();

  if (res === "sat") {
    const model = solver.model();
    const xObj = model.get(x),
      yObj = model.get(y),
      zObj = model.get(z);
    const finalX = isRealVal(xObj) ? xObj.asNumber() : 0;
    const finalY = isRealVal(yObj) ? yObj.asNumber() : 0;
    const finalZ = isRealVal(zObj) ? zObj.asNumber() : 0;

    try {
      return finalX + finalY + finalZ;
    } finally {
      // z3 doesnt exit its threads for some reason and we are done so just
      // exit after aoc runner got the output
      setTimeout(() => {
        process.exit(0);
      });
    }
  } else {
    console.log("conditions unsatisfied");
    return 0;
  }
};

const input = `
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;

run({
  part1: {
    tests: [
      //   {
      //     input,
      //     expected: 2,
      //   },
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
    // @ts-ignore
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
