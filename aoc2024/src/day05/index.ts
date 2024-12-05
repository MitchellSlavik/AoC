import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [ruleLines, updateLines] = rawInput.split("\n\n");
  const rules: string[][]  = ruleLines.split("\n").map((ruleLine) => ruleLine.split("|"));
  const updates: string[][] = updateLines.split("\n").map((updateLine) => updateLine.split(","));

  return { rules, updates }
};

const part1 = (rawInput: string) => {
  const { rules, updates } = parseInput(rawInput);

  let sum = 0;

  updates.forEach((update) => {
    if(rules.every((rule) => {
      let a = rule[0], b = rule[1];

      if(update.includes(a) && update.includes(b)){
        let indexA = update.indexOf(a);
        let indexB = update.indexOf(b);

        if(indexA < indexB){
          return true
        }
        return false
      }
      return true
    })){
      sum += parseInt(update[Math.floor(update.length/2)])
    }
  })

  return sum;
};

const part2 = (rawInput: string) => {
  const { rules, updates } = parseInput(rawInput);

  let sum = 0;

  updates.forEach((update) => {
    const applicableRules = rules.filter((rule) => update.includes(rule[0]) && update.includes(rule[1]));
    if(!applicableRules.every((rule) => update.indexOf(rule[0]) < update.indexOf(rule[1]))){
      for(let i = 0; i < applicableRules.length; i++) {
        let indexA = update.indexOf(applicableRules[i][0]);
        let indexB = update.indexOf(applicableRules[i][1]);
        if(indexA > indexB) {
          update.splice(indexB, 1);
          update.splice(indexA, 0, applicableRules[i][1]);
          i = 0;
        }
      }
      sum += parseInt(update[Math.floor(update.length/2)])
    }
  })

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 143,
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
