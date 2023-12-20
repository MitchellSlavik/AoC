import run from "aocrunner";

interface ModuleBase {
  id: string;
  outputIds: string[];
  inputIds: string[];
}

interface BasicModule extends ModuleBase {
  type: "basic";
}

interface FlipFlopModule extends ModuleBase {
  type: "flipflop";
  on: boolean;
}

interface ConjunctionModule extends ModuleBase {
  type: "conjunction";
  inputs: Record<string, PulseStrength>;
}

type Module = FlipFlopModule | ConjunctionModule | BasicModule;

type PulseStrength = "high" | "low";

interface Pulse {
  strength: PulseStrength;
  from: string;
  to: string;
}

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map<Module>((line) => {
      const [typeId, outputs] = line.split(" -> ");

      if (typeId.startsWith("%")) {
        const id = typeId.substring(1);
        return {
          id,
          outputIds: outputs.split(", "),
          on: false,
          type: "flipflop",
          inputIds: [],
        };
      } else if (typeId.startsWith("&")) {
        const id = typeId.substring(1);
        return {
          id,
          outputIds: outputs.split(", "),
          inputs: {},
          type: "conjunction",
          inputIds: [],
        };
      } else {
        return {
          type: "basic",
          id: typeId,
          outputIds: outputs.split(", "),
          inputIds: [],
        };
      }
    })
    .map((module, i, arr) => {
      module.outputIds.forEach((outId) => {
        const mod = arr.find((v) => v.id === outId);
        if (mod && mod.type === "conjunction") {
          mod.inputs[module.id] = "low";
        }
        if (mod) {
          mod.inputIds.push(module.id);
        }
      });
      return module;
    })
    .reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {} as Record<string, Module>);

const handleModulePulse = (module: Module, pulse: Pulse) => {
  if (module.type === "basic") {
    return module.outputIds.map<Pulse>((outId) => ({
      from: module.id,
      strength: pulse.strength,
      to: outId,
    }));
  } else if (module.type === "flipflop") {
    if (pulse.strength === "low") {
      module.on = !module.on;
      return module.outputIds.map<Pulse>((outId) => ({
        from: module.id,
        strength: module.on ? "high" : "low",
        to: outId,
      }));
    }
  } else if (module.type === "conjunction") {
    module.inputs[pulse.from] = pulse.strength;

    const strength: PulseStrength = Object.keys(module.inputs).some(
      (k) => module.inputs[k] === "low"
    )
      ? "high"
      : "low";

    return module.outputIds.map<Pulse>((outId) => ({
      from: module.id,
      strength,
      to: outId,
    }));
  }
  return [];
};

const part1 = (rawInput: string) => {
  const modules = parseInput(rawInput);

  const queue: Pulse[] = [];
  let highPulses = 0;
  let lowPulses = 0;

  let repeats = 0;
  while (repeats < 1000) {
    queue.push({ from: "button", strength: "low", to: "broadcaster" });

    while (queue.length) {
      const pulse = queue.shift();

      if (pulse.strength === "high") {
        highPulses++;
      } else {
        lowPulses++;
      }

      const module = modules[pulse.to];

      if (module) {
        queue.push(...handleModulePulse(module, pulse));
      }
    }

    repeats++;
  }

  return highPulses * lowPulses;
};

const gcd = (a: number, b: number) => (!b ? a : gcd(b, a % b));

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

const resetModules = (modules: Record<string, Module>) => {
  Object.keys(modules).forEach((key) => {
    const module = modules[key];
    if (module.type === "conjunction") {
      Object.keys(module.inputs).forEach((k) => {
        module.inputs[k] = "low";
      });
    } else if (module.type === "flipflop") {
      module.on = false;
    }
  });
};

const part2 = (rawInput: string) => {
  const modules = parseInput(rawInput);

  const cycleInterval = modules[
    Object.keys(modules).find((key) => modules[key].outputIds.includes("rx"))
  ].inputIds.reduce(
    (prev, id) => ({ ...prev, [id]: 0 }),
    {} as Record<string, number>
  );

  let queue: Pulse[] = [];

  let buttonPresses = 0;
  while (true) {
    buttonPresses++;
    queue.push({ from: "button", strength: "low", to: "broadcaster" });

    while (queue.length) {
      const pulse = queue.shift();

      if (pulse.strength === "low" && cycleInterval[pulse.to] === 0) {
        cycleInterval[pulse.to] = buttonPresses;
        if (!Object.keys(cycleInterval).some((k) => cycleInterval[k] === 0)) {
          return Object.keys(cycleInterval)
            .map((k) => cycleInterval[k])
            .reduce(lcm, 1);
        }
      }

      const module = modules[pulse.to];

      if (module) {
        queue.push(...handleModulePulse(module, pulse));
      }
    }
  }
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
