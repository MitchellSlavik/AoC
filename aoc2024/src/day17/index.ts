import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [registersStr, programStr] = rawInput.split("\n\n");

  const registers = registersStr
    .split("\n")
    .map((line) => parseInt(line.split(": ")[1]));
  const program = programStr
    .split(": ")[1]
    .split(",")
    .map((n) => +n);

  return { registers, program };
};

const runProgram = (registers: number[], program: number[]) => {
  let out = [];

  for (let i = 0; i < program.length; i += 2) {
    const opcode = program[i];
    let comboOperand = program[i + 1];
    let literalOperand = program[i + 1];

    if (comboOperand > 3) {
      comboOperand = registers[comboOperand - 4];
    }

    if (opcode === 0) {
      registers[0] = Math.floor(registers[0] / Math.pow(2, comboOperand));
    } else if (opcode === 1) {
      registers[1] = registers[1] ^ literalOperand;
    } else if (opcode === 2) {
      registers[1] = comboOperand % 8;
    } else if (opcode === 3) {
      if (registers[0] !== 0) {
        i = literalOperand - 2;
      }
    } else if (opcode === 4) {
      registers[1] = registers[1] ^ registers[2];
    } else if (opcode === 5) {
      out.push(comboOperand % 8);
    } else if (opcode === 6) {
      registers[1] = Math.floor(registers[0] / Math.pow(2, comboOperand));
    } else if (opcode === 7) {
      registers[2] = Math.floor(registers[0] / Math.pow(2, comboOperand));
    }
  }

  return out.join(",");
};

const part1 = (rawInput: string) => {
  const { registers, program } = parseInput(rawInput);

  return runProgram(registers, program);
};

interface PossibleNumber {
  bits: string[];
  cutOffBits: string[];
}

const part2 = (rawInput: string) => {
  const { program } = parseInput(rawInput);

  let possibilities: PossibleNumber[] = [
    {
      bits: new Array(54).fill("x"),
      cutOffBits: [],
    },
  ];

  let nextPossibilities: PossibleNumber[] = [];

  for (let i = 0; i < program.length; i++) {
    const target = program[i];

    possibilities.forEach(({ bits, cutOffBits }) => {
      let bit1 = bits[0];
      let bit2 = bits[1];
      let bit3 = bits[2];

      let options: string[] = [];
      if (bit1 === "x") {
        if (bit2 === "x") {
          if (bit3 === "x") {
            options = ["000", "001", "010", "011", "100", "101", "110", "111"];
          } else {
            options = [`${bit3}00`, `${bit3}01`, `${bit3}10`, `${bit3}11`];
          }
        } else {
          if (bit3 === "x") {
            options = [`0${bit2}0`, `0${bit2}1`, `1${bit2}0`, `1${bit2}1`];
          } else {
            options = [`${bit3}${bit2}0`, `${bit3}${bit2}1`];
          }
        }
      } else {
        if (bit2 === "x") {
          if (bit3 === "x") {
            options = [`00${bit1}`, `01${bit1}`, `10${bit1}`, `11${bit1}`];
          } else {
            options = [`${bit3}0${bit1}`, `${bit3}1${bit1}`];
          }
        } else {
          if (bit3 === "x") {
            options = [`0${bit2}${bit1}`, `1${bit2}${bit1}`];
          } else {
            options = [`${bit3}${bit2}${bit1}`];
          }
        }
      }

      options.forEach((o) => {
        let b = parseInt(o, 2) ^ 3;
        let c = target ^ 5 ^ b;
        let cBits = [0, 1, 2]
          .map((n) => Math.floor(c / Math.pow(2, n)) % 2)
          .map((n) => `${n}`);
        let optionBits = [...o.split("").reverse(), ...bits.slice(3)];

        if (optionBits[b] === "x" || optionBits[b] === cBits[0]) {
          if (optionBits[b + 1] === "x" || optionBits[b + 1] === cBits[1]) {
            if (optionBits[b + 2] === "x" || optionBits[b + 2] === cBits[2]) {
              optionBits[b] = cBits[0];
              optionBits[b + 1] = cBits[1];
              optionBits[b + 2] = cBits[2];
              nextPossibilities.push({
                bits: optionBits.slice(3),
                cutOffBits: cutOffBits.concat(optionBits.slice(0, 3)),
              });
            }
          }
        }
      });
    });

    possibilities = nextPossibilities;
    nextPossibilities = [];
  }

  let minNumber = Infinity;

  possibilities.forEach(({ bits, cutOffBits }) => {
    const bitStr =
      bits
        .reverse()
        .map((n) => (n === "x" ? "0" : n))
        .join("") + cutOffBits.reverse().join("");
    const number = parseInt(bitStr, 2);
    if (number < minNumber) {
      minNumber = number;
    }
  });

  return minNumber;
};

run({
  part1: {
    tests: [
      {
        input: `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`,
        expected: "4,6,3,5,6,3,5,2,1,0",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      //       {
      //         input: `Register A: 2024
      // Register B: 0
      // Register C: 0
      // Program: 0,3,5,4,3,0`,
      //         expected: 117440,
      //       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
