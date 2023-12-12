import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const enumerateOptions = (s: string): string[] => {
  if (s.includes("?")) {
    return [
      ...enumerateOptions(s.replace("?", ".")),
      ...enumerateOptions(s.replace("?", "#")),
    ];
  }
  return [s];
};

const arrEqual = (a: any[], b: any[]) => {
  if (a.length === b.length) {
    return !a.some((z, i) => z !== b[i]);
  }
  return false;
};

let cache = {};

const def = (s: string, numArr: number[]) => {
  let key = s + numArr.join(",");
  if (cache[key] !== undefined) {
    return cache[key];
  }
  cache[key] = abc(s, numArr);
  return cache[key];
};

//`??????????? 8,1`
const abc = (s: string, numArr: number[]) => {
  // console.log(s, numArr);
  if (numArr.length === 0) {
    if (s.replace(new RegExp("(\\.|\\?)", "g"), "").length === 0) {
      //console.log(s, numArr, 1);
      return 1;
    }
    //console.log(s, numArr, 0);
    return 0;
  }
  if (s.match(new RegExp(`^(\\#|\\?){${numArr[0]}}`))) {
    if (
      s.substring(numArr[0]).startsWith("?") ||
      s.substring(numArr[0]).startsWith(".")
    ) {
      let r =
        def(s.substring(numArr[0] + 1), numArr.slice(1)) +
        (s.startsWith("#") ? 0 : def(s.substring(1), numArr));
      //console.log(s, numArr, r);
      return r;
    } else if (s.substring(numArr[0]).startsWith("#")) {
      let r = s.startsWith("#") ? 0 : def(s.substring(1), numArr);
      // console.log(s, numArr, r);
      return r;
    } else if (s.substring(numArr[0]).length === 0) {
      if (numArr.length === 1) {
        let r = 1;
        // console.log(s, numArr, r);
        return r;
      } else {
        let r = 0;
        // console.log(s, numArr, r);
        return r;
      }
    }
  } else if (s.startsWith(".")) {
    let nextStr = s;
    while (nextStr.startsWith(".")) {
      nextStr = nextStr.substring(1);
    }
    let r = def(nextStr, numArr);
    // console.log(s, numArr, r);
    return r;
  } else if (s.startsWith("?")) {
    let nextStr = s;
    while (nextStr.startsWith("?")) {
      nextStr = nextStr.substring(1);
    }
    let r = def(nextStr, numArr);
    // console.log(s, numArr, r);
    return r;
  }
  // console.log(s, numArr, 0);
  return 0;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .split("\n")
    .map((line) => {
      const [rest, groups] = line.split(" ");
      const groupNums = groups.split(",").map((s) => Number(s));
      cache = {};
      return abc(rest, groupNums);

      const options = enumerateOptions(rest);

      return options
        .map((s) => {
          return arrEqual(
            [...s.matchAll(new RegExp("#+", "g"))].map((a) => a[0].length),
            groupNums
          )
            ? 1
            : 0;
        })
        .reduce((prev, curr) => prev + curr, 0);
    })
    .reduce((prev, curr) => prev + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .split("\n")
    .map((line, index) => {
      const [rest, groups] = line.split(" ");
      const groupNums = new Array(5)
        .fill(groups)
        .join(",")
        .split(",")
        .map((s) => Number(s));
      cache = {};
      const options = abc(new Array(5).fill(rest).join("?"), groupNums);
      // console.log(index, line, options);
      return options;
    })
    .reduce((prev, curr) => prev + curr, 0);
};

/*
const input = parseInput(rawInput);

  return input.split("\n").map((line) => {
    const [rest, groups] = line.split(" ");
    const groupNums = groups.split(",").map((s) => Number(s));
    const options = enumerateOptions(rest);

    let a = options.map((s) => {
       return arrEqual([...s.matchAll(new RegExp("#+", "g"))].map((a) => a[0].length), groupNums) ? 1 : 0
    }).reduce((prev, curr) => prev + curr, 0);

    let b = rest.startsWith("#") ? a : enumerateOptions(rest+ "?").map((s) => {
       return arrEqual([...s.matchAll(new RegExp("#+", "g"))].map((a) => a[0].length), groupNums) ? 1 : 0
    }).reduce((prev, curr) => prev + curr, 0);

    let c = rest.endsWith("#") ? a : enumerateOptions("?"+ rest).map((s) => {
       return arrEqual([...s.matchAll(new RegExp("#+", "g"))].map((a) => a[0].length), groupNums) ? 1 : 0
    }).reduce((prev, curr) => prev + curr, 0);

    // console.log("a", a, "b", b, "c", c);

    if(b > c) {
        return Math.pow(b, 4)*a;
    } else {
        return Math.pow(c, 4)*a;
    }
  }).reduce((prev, curr) => prev + curr, 0);
  */

const input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

// const input = `?###???????? 3,2,1`;
// const input = `???????###???????? 3,2,1`;

/*
?###???????? 3,2,1=> 0
 ###???????? 3,2,1=> ?
     ??????? 2,1=> 4
        ???? 1=> 4
      ?????? 2,1=> 6
       ????? 2,1=> 3
        ???? 2,1=> 1
*/

run({
  part1: {
    tests: [
      {
        input,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
