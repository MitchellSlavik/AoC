import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.split("\n").map((line) => {
    const [gameId, rest] = line.split(":");
    let games = rest.split(";");
    let valid = true;

    games.forEach((game) => {
      const parts = game.split(",");
      parts.forEach((part) => {
        const [num, color] = part.trim().split(" ");
        const parsedNumber = Number(num);
        switch(color){
          case 'green':
            if(parsedNumber > 13) {
              valid = false;
            }
            break;
          case 'blue':
            if(parsedNumber > 14) {
              valid = false;
            }
            break
          case 'red':
            if(parsedNumber > 12){
              valid = false;
            }
        }
      })
    });

    if(valid) {
      return Number(gameId.split(" ")[1]);
    } else {
      return 0;
    }
  }).reduce((prev, curr) => prev + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.split("\n").map((line) => {
    const [gameId, rest] = line.split(":");
    let games = rest.split(";");
    let valid = true;

    let red = 0, blue= 0, green= 0;

    games.forEach((game) => {
      const parts = game.split(",");
      parts.forEach((part) => {
        const [num, color] = part.trim().split(" ");
        const parsedNumber = Number(num);
        switch(color){
          case 'green':
            green = Math.max(parsedNumber, green);
            break;
          case 'blue':
            blue = Math.max(parsedNumber, blue);
            break
          case 'red':
            red = Math.max(parsedNumber, red);
            break;
        }
      })
    });

    return red * blue * green;
  }).reduce((prev, curr) => prev + curr, 0);
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
