import run from "aocrunner";
import { Arith, init } from "z3-solver";

interface StateWithNumButtonsPressed {
  state: boolean[];
  numButtonsPressed: number;
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  return lines.map((line) => {
    const spaceSplit = line.split(" ");
    const endState = spaceSplit[0]
      .substring(1, spaceSplit[0].length - 1)
      .split("")
      .map((c) => (c === "." ? false : true));
    const buttons = spaceSplit.slice(1, spaceSplit.length - 1).map((b) =>
      b
        .substring(1, b.length - 1)
        .split(",")
        .map((p) => parseInt(p)),
    );
    const joltage = spaceSplit[spaceSplit.length - 1]
      .substring(1, spaceSplit[spaceSplit.length - 1].length - 1)
      .split(",")
      .map((p) => parseInt(p));
    return { endState, buttons, joltage };
  });
};

const handleButtonPress = (
  currentState: boolean[],
  button: number[],
): boolean[] => {
  const newState = [...currentState];
  button.forEach((b) => {
    newState[b] = !newState[b];
  });
  return newState;
};

const isSameState = (state1: boolean[], state2: boolean[]): boolean => {
  return state1.every((s, index) => s === state2[index]);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;

  input.forEach(({ endState, buttons }) => {
    let currentStates: StateWithNumButtonsPressed[] = [
      { state: [...endState.map((s) => false)], numButtonsPressed: 0 },
    ];
    let cachedStates = new Set<string>();

    while (currentStates.length > 0) {
      const currentState = currentStates.shift();
      if (isSameState(currentState.state, endState)) {
        sum += currentState.numButtonsPressed;
        return;
      }
      buttons.forEach((button) => {
        const newState = handleButtonPress(currentState.state, button);
        if (cachedStates.has(newState.toString())) {
          return;
        }
        cachedStates.add(newState.toString());
        currentStates.push({
          state: newState,
          numButtonsPressed: currentState.numButtonsPressed + 1,
        });
      });
    }

    console.log("RAN OUT OF STATES OH NO, saw ", cachedStates.size, " states");
  });

  return sum;
};

const part2 = async (rawInput: string) => {
  const { Context } = await init();
  const { Optimize, Int, Eq, Sum, Array: z3Array, isIntVal } = Context("main");
  const input = parseInput(rawInput);
  let sum = 0;
  for (let index = 0; index < input.length; index++) {
    const optimizer = new Optimize();
    const { joltage, buttons } = input[index];
    const constants = new Array(buttons.length).fill(0).map((_, i) => {
      return Int.const(`b${i}`);
    });
    // Add constraint that button presses must be non-negative
    constants.forEach((c) => {
      optimizer.add(c.ge(0));
    });
    const constraints = new Array(joltage.length).fill(0).map((_, ind) => {
      const coeffs = constants.map((c, i) =>
        c.mul(buttons[i].includes(ind) ? 1 : 0),
      ) as Arith<"main">[];
      return Eq(joltage[ind], Sum(Int.val(0), ...coeffs));
    });
    optimizer.add(...constraints);

    // Minimize the total number of button presses
    const totalPresses = Sum(Int.val(0), ...constants);
    optimizer.minimize(totalPresses);

    const solution = await optimizer.check();
    if (solution === "sat") {
      const model = optimizer.model();
      const buttonPresses = constants.map((c) => {
        const val = model.get(c);
        if (isIntVal(val)) {
          return Number(val.value()); // value() returns bigint, convert to number
        } else {
          console.warn("Unexpected value type:", val);
          return 0;
        }
      });
      const totalPressesCount = buttonPresses.reduce((a, b) => a + b, 0);
      sum += totalPressesCount;
    } else {
      console.log("No solution found for input:", index + 1);
    }
  }
  return sum;
};

const input = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

run({
  part1: {
    tests: [
      {
        input: input,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: 33,
      },
    ],
    // @ts-ignore
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
