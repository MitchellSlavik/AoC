import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

interface Step {
  condition?: string;
  result: string;
}

interface Condition {
  label: string;
  lt: boolean;
  gt: boolean;
  value: number;
}

interface StepP2 {
  condition?: Condition;
  result: string;
}

type Workflows = Record<string, Array<Step>>;

type WorkflowsP2 = Record<string, Array<StepP2>>;

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

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const [workflowsS, partsS] = input.split("\n\n");

  const workflows = workflowsS.split("\n").reduce((prev, line) => {
    const [id, workflowS] = line.substring(0, line.length - 1).split("{");
    const stepsS = workflowS.split(",");

    const steps = stepsS.map<Step>((step) => {
      if (!step.includes(":")) {
        return {
          result: step,
        };
      } else {
        return {
          result: step.split(":")[1],
          condition: step.split(":")[0],
        };
      }
    });

    prev[id] = steps;

    return prev;
  }, {} as Workflows);

  return partsS
    .split("\n")
    .map((line) => {
      const properties = line.substring(1, line.length - 1).split(",");

      const part = properties.reduce((prev, curr) => {
        const [label, value] = curr.split("=");
        prev[label] = Number(value);
        return prev;
      }, {} as Part);

      let currentWorkflow = "in";

      while (currentWorkflow !== "A" && currentWorkflow !== "R") {
        const steps = workflows[currentWorkflow];

        for (let i = 0; i < steps.length; i++) {
          if (steps[i].condition) {
            const r = eval(`part.${steps[i].condition}`);
            if (r === true) {
              currentWorkflow = steps[i].result;
              break;
            }
          } else {
            currentWorkflow = steps[i].result;
            break;
          }
        }
      }

      if (currentWorkflow === "A") {
        return part.a + part.m + part.s + part.x;
      }
      return 0;
    })
    .reduce((prev, curr) => prev + curr, 0);
};

let workflowsP2: WorkflowsP2 = {};

const partRangeCombos = (pr: PartRange) =>
  (pr.aMax - pr.aMin + 1) *
  (pr.mMax - pr.mMin + 1) *
  (pr.sMax - pr.sMin + 1) *
  (pr.xMax - pr.xMin + 1);

const handlePartRange = (workflow: string, partRange: PartRange) => {
  if (workflow === "R") {
    return 0;
  }
  if (workflow === "A") {
    return partRangeCombos(partRange);
  }

  let remainingPartRange = partRange;
  const steps = workflowsP2[workflow];
  let acc = 0;

  for (let i = 0; i < steps.length; i++) {
    if (steps[i].condition) {
      const condition = steps[i].condition;
      if (condition.value < remainingPartRange[condition.label + "Min"]) {
        if (condition.lt) {
          continue;
        } else if (condition.gt) {
          return acc + handlePartRange(steps[i].result, remainingPartRange);
        }
      } else if (
        condition.value > remainingPartRange[condition.label + "Max"]
      ) {
        if (condition.lt) {
          return acc + handlePartRange(steps[i].result, remainingPartRange);
        } else if (condition.gt) {
          continue;
        }
      } else {
        if (condition.gt) {
          let range1 = {
            ...remainingPartRange,
            [condition.label + "Max"]: condition.value,
          };
          let range2 = {
            ...remainingPartRange,
            [condition.label + "Min"]: condition.value + 1,
          };
          remainingPartRange = range1;
          acc += handlePartRange(steps[i].result, range2);
        } else if (condition.lt) {
          let range1 = {
            ...remainingPartRange,
            [condition.label + "Max"]: condition.value - 1,
          };
          let range2 = {
            ...remainingPartRange,
            [condition.label + "Min"]: condition.value,
          };
          remainingPartRange = range2;
          acc += handlePartRange(steps[i].result, range1);
        }
      }
    } else {
      acc += handlePartRange(steps[i].result, remainingPartRange);
    }
  }

  return acc;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  workflowsP2 = input
    .split("\n\n")[0]
    .split("\n")
    .reduce((prev, line) => {
      const [id, workflowS] = line.substring(0, line.length - 1).split("{");
      const stepsS = workflowS.split(",");

      const steps = stepsS.map<StepP2>((step) => {
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
              label,
              lt: cond.includes("<"),
              gt: cond.includes(">"),
              value: Number(number),
            },
          };
        }
      });

      prev[id] = steps;

      return prev;
    }, {} as WorkflowsP2);

  return handlePartRange("in", {
    aMax: 4000,
    aMin: 1,
    mMax: 4000,
    mMin: 1,
    sMax: 4000,
    sMin: 1,
    xMax: 4000,
    xMin: 1,
  });
};

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
