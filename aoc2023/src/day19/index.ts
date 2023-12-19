import run from "aocrunner";

interface Condition {
  propName: string;
  lt: boolean;
  gt: boolean;
  value: number;
}

interface Step {
  condition?: Condition;
  result: string;
}

type Workflows = Record<string, Array<Step>>;

interface Part {
  a: number;
  m: number;
  x: number;
  s: number;
}

interface PartRange {
  aMin: number;
  aMax: number;
  mMin: number;
  mMax: number;
  xMin: number;
  xMax: number;
  sMin: number;
  sMax: number;
}

const parseInput = (rawInput: string): [Workflows, Part[]] => {
  const [workflowsS, partsS] = rawInput.split("\n\n");

  const workflows = workflowsS.split("\n").reduce((prev, line) => {
    const [id, workflowS] = line.substring(0, line.length - 1).split("{");

    prev[id] = workflowS.split(",").map<Step>((step) => {
      if (!step.includes(":")) {
        return {
          result: step,
        };
      } else {
        const [cond, result] = step.split(":");
        const [label, number] = cond.split(new RegExp("\\<|\\>", "g"));
        return {
          result,
          condition: {
            propName: label,
            lt: cond.includes("<"),
            gt: cond.includes(">"),
            value: Number(number),
          },
        };
      }
    });

    return prev;
  }, {} as Workflows);

  const parts = partsS.split("\n").map((line) =>
    line
      .substring(1, line.length - 1)
      .split(",")
      .reduce((prev, curr) => {
        const [label, value] = curr.split("=");
        prev[label] = Number(value);
        return prev;
      }, {} as Part)
  );

  return [workflows, parts];
};

const part1 = (rawInput: string) => {
  const [workflows, parts] = parseInput(rawInput);

  return parts
    .map((part) => {
      let currentWorkflow = "in";
      while (currentWorkflow !== "A" && currentWorkflow !== "R") {
        const steps = workflows[currentWorkflow];
        for (let i = 0; i < steps.length; i++) {
          const { condition, result } = steps[i];
          if (
            !condition ||
            eval(
              `part.${condition.propName}${condition.lt ? "<" : ">"}${
                condition.value
              }`
            ) === true
          ) {
            currentWorkflow = result;
            break;
          }
        }
      }
      return currentWorkflow === "A" ? part.a + part.m + part.s + part.x : 0;
    })
    .reduce((prev, curr) => prev + curr, 0);
};

const partRangeCombos = (pr: PartRange) =>
  (pr.aMax - pr.aMin + 1) *
  (pr.mMax - pr.mMin + 1) *
  (pr.sMax - pr.sMin + 1) *
  (pr.xMax - pr.xMin + 1);

const handlePartRange = (
  workflows: Workflows,
  workflow: string,
  partRange: PartRange
) => {
  if (workflow === "R") {
    return 0;
  }
  if (workflow === "A") {
    return partRangeCombos(partRange);
  }

  let remainingPartRange = partRange;
  const steps = workflows[workflow];
  let acc = 0;

  for (let i = 0; i < steps.length; i++) {
    const c = steps[i].condition;
    if (c) {
      if (c.value < remainingPartRange[c.propName + "Min"]) {
        if (c.gt) {
          acc += handlePartRange(
            workflows,
            steps[i].result,
            remainingPartRange
          );
          break;
        }
      } else if (c.value > remainingPartRange[c.propName + "Max"]) {
        if (c.lt) {
          acc += handlePartRange(
            workflows,
            steps[i].result,
            remainingPartRange
          );
          break;
        }
      } else {
        if (c.gt) {
          let range1 = {
            ...remainingPartRange,
            [c.propName + "Max"]: c.value,
          };
          let range2 = {
            ...remainingPartRange,
            [c.propName + "Min"]: c.value + 1,
          };
          remainingPartRange = range1;
          acc += handlePartRange(workflows, steps[i].result, range2);
        } else if (c.lt) {
          let range1 = {
            ...remainingPartRange,
            [c.propName + "Max"]: c.value - 1,
          };
          let range2 = {
            ...remainingPartRange,
            [c.propName + "Min"]: c.value,
          };
          remainingPartRange = range2;
          acc += handlePartRange(workflows, steps[i].result, range1);
        }
      }
    } else {
      acc += handlePartRange(workflows, steps[i].result, remainingPartRange);
    }
  }

  return acc;
};

const part2 = (rawInput: string) =>
  handlePartRange(parseInput(rawInput)[0], "in", {
    aMax: 4000,
    aMin: 1,
    mMax: 4000,
    mMin: 1,
    sMax: 4000,
    sMin: 1,
    xMax: 4000,
    xMin: 1,
  });

const input = `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;

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
      {
        input,
        expected: 167409079868000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
