import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

interface NumMap {
  from: number;
  to: number;
  range: number;
}

interface Range {
  low: number;
  high: number;
}

const convert = (ranges: Range[], mappings: NumMap[]): Range[] => {
  const newRanges: Range[] = [];
  const rangesToParse: Range[] = [...ranges];

  while(rangesToParse.length > 0){
    // console.log("ranges left: ", rangesToParse.length)
    let currRange = rangesToParse.shift();
    let foundMapping = false;
    for(let i = 0; i < mappings.length; i++) {
      if(foundMapping) {
        break;
      }
      const mapping = mappings[i];
      
      if(currRange.high >= mapping.from + mapping.range) {
        if(currRange.low < mapping.from + mapping.range) {
          if(currRange.low < mapping.from) {
            // break into 2 more ranges
            // convert mid
            rangesToParse.push({
              low: currRange.low,
              high: mapping.from - 1,
            });
            rangesToParse.push({
              low: mapping.from + mapping.range,
              high: currRange.high,
            })
            newRanges.push({
              low: mapping.to,
              high: mapping.to + mapping.range - 1
            });
            foundMapping = true;
          } else {
            // break into another range
            rangesToParse.push({
              low: mapping.from + mapping.range,
              high: currRange.high,
            })
            // convert lower
            newRanges.push({
              low: currRange.low - mapping.from + mapping.to,
              high: mapping.to + mapping.range - 1
            });
            foundMapping = true;
          }
        } else {
          // out of range
        }
      } else if(currRange.high < mapping.from) {
        // out of range
      } else {
        if(currRange.low < mapping.from) {
          // break into another range
          rangesToParse.push({
            low: currRange.low,
            high: mapping.from - 1,
          })
          //convert upper
          newRanges.push({
            low: mapping.to,
            high: currRange.high - mapping.from + mapping.to,
          })
            foundMapping = true;
        } else {
          newRanges.push({
            low: currRange.low - mapping.from + mapping.to,
            high: currRange.high - mapping.from + mapping.to,
          });
            foundMapping = true;
        }
      }
    };
    if(!foundMapping) {
      newRanges.push(currRange);
    }
  }
  return newRanges;
}

const parseMap = (lineGroup: string): NumMap[] => {
  return lineGroup.split(":")[1].trim().split("\n").map((line) => {
    const [to, from, range] = line.split(" ");
    return {
      from: Number(from),
      to: Number(to),
      range: Number(range)
    }
  });
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let seeds: number[] = [];

  const lineGroups = input.split("\n\n");

  seeds = lineGroups[0].split(":")[1].trim().split(" ").map((s) => Number(s));

  const maps = new Array(7).fill(0).map((_, index) => {
    return parseMap(lineGroups[index+1]);
  });

  return seeds.map((seed) => {
    // console.log("SEED: ", seed)
    let currValue = seed;
    for(let a = 0; a < maps.length; a++) {
      let found = false;
      for(let b = 0; b < maps[a].length; b++){
        if(currValue >= maps[a][b].from && currValue < maps[a][b].from + maps[a][b].range) {
          //console.log("from ", currValue, " to ",  currValue - maps[a][b].from + maps[a][b].to)
          currValue = currValue - maps[a][b].from + maps[a][b].to;
          found = true;
          break;
        }
      }
      if(!found) {
        //console.log("map ", a, " not found leaving value")
      }
    }
    return currValue;
  }).sort((a,b) => a-b)[0];
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let seeds: number[] = [];

  const lineGroups = input.split("\n\n");

  seeds = lineGroups[0].split(":")[1].trim().split(" ").map((s) => Number(s));

  const maps = new Array(7).fill(0).map((_, index) => {
    return parseMap(lineGroups[index+1]);
  });

  return seeds.map((seed, index, arr) => {
    if(index % 2 === 1) return Infinity;

    let currRanges: Range[] = [{ low: seed, high: seed + arr[index+1] - 1}];
    for(let a = 0; a < maps.length; a++) {
      currRanges = convert(currRanges, maps[a]);
    }

    return currRanges.sort((a, b) => a.low-b.low)[0].low;
  }).sort((a,b) => a-b)[0];
};

let input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

run({
  part1: {
    tests: [
      {
        input: input,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
