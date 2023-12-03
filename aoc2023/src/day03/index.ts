import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;

  input.split("\n").map((line, index, arr) => {
    const matches = [...line.matchAll(new RegExp("[0-9]+", "g"))];

    matches.forEach((numMatch) => {
      const matchIndex = numMatch.index;
      const matchLength = numMatch[0].length;
      if(index !== 0 && arr[index-1].substring(Math.max(0, matchIndex-1), matchIndex + matchLength + 1).replace(new RegExp("([0-9]|\\.)", "g"), "").length > 0) {
        sum += Number(numMatch[0]);
        return;
      }
      if(index !== arr.length - 1 && arr[index+1].substring(Math.max(0, matchIndex-1), matchIndex + matchLength + 1).replace(new RegExp("([0-9]|\\.)", "g"), "").length > 0) {
        sum += Number(numMatch[0]);
        return;
      }
      if(matchIndex !== 0 && line.charAt(matchIndex-1) !== ".") {
        sum += Number(numMatch[0]);
        return;
      }
      if(matchIndex + matchLength < line.length && line.charAt(matchIndex + matchLength) !== ".") {
        sum += Number(numMatch[0]);
        return;
      }
    })
  })

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const isDigit = (char: string) => !!char.match(new RegExp("[0-9]", "g"));

  let sum = 0;

  input.split("\n").forEach((line, index, arr) => {
    const matches = [...line.matchAll(new RegExp("\\*", "g"))];
    //console.log(matches);
    
     matches.forEach((numMatch) => {
      let adjacentNumbers = 0;
      let nums = [];
      let value = 1;
      const matchIndex = numMatch.index;
      const matchLength = numMatch[0].length;
      if(index !== 0) {
        let sub = arr[index-1].substring(Math.max(0, matchIndex-1), matchIndex + matchLength + 1);
        if(sub.match(new RegExp("[0-9]\\.[0-9]", "g"))) {
          adjacentNumbers += 2;
          for(let i = 1; i < 3; i++){
            if(matchIndex -1-i >= 0 && isDigit(arr[index-1].charAt(matchIndex-1-i))){
              sub = arr[index-1].charAt(matchIndex-1-i) + sub;
            } else {
              break;
            }
          }
          for(let i = 1; i < 3; i++){
            if(matchIndex + matchLength + i < arr[index-1].length && isDigit(arr[index-1].charAt(matchIndex + matchLength + i))){
              sub = sub + arr[index-1].charAt(matchIndex + matchLength + i);
            } else {
              break;
            }
          }
          nums = nums.concat(sub.split(".").map((a) => Number(a)));
          value *= sub.split(".").map((a) => Number(a)).reduce((curr, prev) => curr * prev, 1);
        } else if(sub.match(new RegExp("[0-9]+", "g"))) {
          adjacentNumbers += 1;
          if(isDigit(sub.charAt(0))){
            for(let i = 1; i < 3; i++){
              if(matchIndex -1-i >= 0 && isDigit(arr[index-1].charAt(matchIndex-1-i))){
                sub = arr[index-1].charAt(matchIndex-1-i) + sub;
              } else {
                break;
              }
            }
          }
          if(isDigit(sub.charAt(sub.length-1))){
            for(let i = 1; i < 3; i++){
              if(matchIndex + matchLength + i < arr[index-1].length && isDigit(arr[index-1].charAt(matchIndex + matchLength + i))){
                sub = sub + arr[index-1].charAt(matchIndex + matchLength + i);
              } else {
                break;
              }
            }
          }
          nums = nums.concat(Number(sub.replace(new RegExp("[^0-9]", "g"), "")));
          value *= Number(sub.replace(new RegExp("[^0-9]", "g"), ""));
        }
      }
      if(index !== arr.length - 1) {
        let sub = arr[index + 1].substring(Math.max(0, matchIndex-1), matchIndex + matchLength + 1);
        if(sub.match(new RegExp("[0-9]\\.[0-9]", "g"))) {
          adjacentNumbers += 2;
          for(let i = 1; i < 3; i++){
            if(matchIndex -1-i >= 0 && isDigit(arr[index+1].charAt(matchIndex-1-i))){
              sub = arr[index+1].charAt(matchIndex-1-i) + sub;
            } else {
              break;
            }
          }
          for(let i = 1; i < 3; i++){
            if(matchIndex + matchLength + i < arr[index+1].length && isDigit(arr[index+1].charAt(matchIndex + matchLength + i))){
              sub = sub + arr[index+1].charAt(matchIndex + matchLength + i);
            } else {
              break;
            }
          }
          nums = nums.concat(sub.split(".").map((a) => Number(a)));
          value *= sub.split(".").map((a) => Number(a)).reduce((curr, prev) => curr * prev, 1);
        } else if(sub.match(new RegExp("[0-9]+", "g"))) {
          adjacentNumbers += 1;
          if(isDigit(sub.charAt(0))){
            for(let i = 1; i < 3; i++){
              if(matchIndex -1-i >= 0 && isDigit(arr[index+1].charAt(matchIndex-1-i))){
                sub = arr[index+1].charAt(matchIndex-1-i) + sub;
              } else {
                break;
              }
            }
          }
          
          if(isDigit(sub.charAt(sub.length-1))){
            for(let i = 1; i < 3; i++){
              if(matchIndex + matchLength + i < arr[index+1].length && isDigit(arr[index+1].charAt(matchIndex + matchLength + i))){
                sub = sub + arr[index+1].charAt(matchIndex + matchLength + i);
              } else {
                break;
              }
            }
          }
          nums = nums.concat(Number(sub.replace(new RegExp("[^0-9]", "g"), "")));
          value *= Number(sub.replace(new RegExp("[^0-9]", "g"), ""));
        }
      }
      if(matchIndex !== 0 && line.charAt(matchIndex-1).match(new RegExp("[0-9]", "g"))) {
        adjacentNumbers += 1;
        let sub = line.charAt(matchIndex-1);
        for(let i = 1; i < 3; i++){
          if(matchIndex -1-i >= 0 && isDigit(line.charAt(matchIndex-1-i))){
            sub = line.charAt(matchIndex-1-i) + sub;
          } else {
            break;
          }
        }
        nums.push(Number(sub));
        value *= Number(sub);
      }
      if(matchIndex + matchLength < line.length && line.charAt(matchIndex + matchLength).match(new RegExp("[0-9]", "g"))) {
        adjacentNumbers += 1;
        let sub = line.charAt(matchIndex + matchLength);
        for(let i = 1; i < 3; i++){
          if(matchIndex + matchLength + i < line.length && isDigit(line.charAt(matchIndex + matchLength + i))){
            sub = sub + line.charAt(matchIndex + matchLength + i);
          } else {
            break;
          }
        }
        nums.push(Number(sub));
        value *= Number(sub);
      }

      if (adjacentNumbers === 2) {
        // console.log(value, index, matchIndex, nums)
        sum += value;
      }
    })
  })

  return sum;
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
