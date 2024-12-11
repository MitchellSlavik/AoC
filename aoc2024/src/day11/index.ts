import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(" ").map((n) => parseInt(n));

const addRock = (rocks: Record<number, number>, engraving: number, numRocks: number)=>{
  if(rocks[engraving]){
    rocks[engraving]+=numRocks;
  }else{
    rocks[engraving]=numRocks;
  }
}

const solve = (input: number[], iterations: number) => {
  let rocks: Record<number, number> = {}
  for(let i = input.length-1; i >= 0; i--){
    addRock(rocks, input[i], 1);
  }
  for(let b = 0; b < iterations; b++){
    let newRocks: Record<number, number> = {}
    
    Object.keys(rocks).forEach((k) => {
      let n = +k;
      if(n === 0){
        addRock(newRocks, 1, rocks[n]);
      } else if(k.length % 2 === 0){
        addRock(newRocks, parseInt(k.substring(0, k.length/2)), rocks[n]);
        addRock(newRocks, parseInt(k.substring(k.length/2)), rocks[n]);
      } else {
        addRock(newRocks, n*2024, rocks[n]);
      }
    })
    rocks = newRocks;
  }

  return Object.keys(rocks).reduce((prev, k) => prev + rocks[k], 0)
}

const part1 = (rawInput: string) => solve(parseInput(rawInput), 25);
const part2 = (rawInput: string) => solve(parseInput(rawInput), 75);

run({
  part1: {
    tests: [
      {
        input: `125 17`,
        expected:55312,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
