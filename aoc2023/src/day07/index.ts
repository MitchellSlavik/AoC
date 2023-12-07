import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const digitRegex = new RegExp("[2-9]", "g");

const cardToValue = (c: string) => {
  if(c.match(digitRegex)){
    return Number(c);
  } else {
    switch(c) {
      case 'A' : return 14;
      case 'K' : return 13;
      case 'Q' : return 12;
      case 'J' : return 11;
      case 'T' : return 10;
    }
  }
}

const cardToValueP2 = (c: string) => {
  if(c.match(digitRegex)){
    return Number(c);
  } else {
    switch(c) {
      case 'A' : return 14;
      case 'K' : return 13;
      case 'Q' : return 12;
      case 'J' : return 1;
      case 'T' : return 10;
    }
  }
}

const compareCard = (a: string, b: string) => {
  return cardToValue(a) - cardToValue(b);
}

const compareCardP2 = (a: string, b: string) => {
  return cardToValueP2(a) - cardToValueP2(b);
}

interface HandAndBet {
  hand: string;
  bet: number;
}

const getHandOrder = (h: string) => {
  let handMap = new Map();
  h.split("").forEach((c) => {
    if(handMap.has(c)){
      handMap.set(c, handMap.get(c) + 1);
    } else {
      handMap.set(c, 1);
    }
  });
  if(handMap.size === 1) {
    return 7;
  }
  if(handMap.size === 2) {
    if([...handMap.values()].includes(4)) {
      return 6;
    } else {
      return 5;
    }
  }
  if(handMap.size === 3) {
    if([...handMap.values()].includes(3)) {
      return 4;
    } else {
      return 3;
    }
  }
  if(handMap.size === 4) {
    return 2;
  }
  if(handMap.size === 5) {
    return 1;
  }
  console.log("no hand order for: ", h)
  return 0;
}

const getHandOrderP2 = (h: string) => {
  let handMap = new Map();
  h.split("").forEach((c) => {
    if(handMap.has(c)){
      handMap.set(c, handMap.get(c) + 1);
    } else {
      handMap.set(c, 1);
    }
  });
  const jokerNumber = handMap.get("J") || 0;
  handMap.delete("J");
  const handMapValues = [...handMap.values()];
  if(handMap.size === 1 || handMap.size === 0) {
    return 7;
  }
  if(handMap.size === 2) {
    if(handMapValues.includes(1)) {
      return 6;
    } else {
      return 5;
    }
  }
  if(handMap.size === 3) {
    if((handMapValues.includes(3) && jokerNumber === 0) || jokerNumber > 0) {
      return 4;
    } else {
      return 3;
    }
  }
  if(handMap.size === 4) {
    return 2;
  }
  if(handMap.size === 5) {
    return 1;
  }
  // console.log("no hand order for: ", h)
  return 0;
}

const compareHands = (a: HandAndBet, b: HandAndBet) => {
  const aOrder = getHandOrder(a.hand);
  const bOrder = getHandOrder(b.hand);

  if(aOrder === bOrder) {
    for(let i = 0; i < 5; i++) {
      let cardCompare = compareCard(a.hand.charAt(i), b.hand.charAt(i));
      if(cardCompare != 0) {
        return cardCompare;
      }
    }
    return 0;
  } else {
    return aOrder - bOrder;
  }
}

const compareHandsP2 = (a: HandAndBet, b: HandAndBet) => {
  const aOrder = getHandOrderP2(a.hand);
  const bOrder = getHandOrderP2(b.hand);

  if(aOrder === bOrder) {
    for(let i = 0; i < 5; i++) {
      let cardCompare = compareCardP2(a.hand.charAt(i), b.hand.charAt(i));
      if(cardCompare != 0) {
        return cardCompare;
      }
    }
    return 0;
  } else {
    return aOrder - bOrder;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.split("\n").map((line) => {
    const [hand, bet] = line.split(" ");

    return {
      hand,
      bet: Number(bet),
    }
  }).sort((a, b) => {
    return compareHands(a, b);
  }).map((hand, index, arr) => {
    // console.log(hand.hand, "  ", hand.bet, " * ", index+1);
    return hand.bet * (index+1);
  }).reduce((prev, curr) => prev + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.split("\n").map((line) => {
    const [hand, bet] = line.split(" ");

    return {
      hand,
      bet: Number(bet),
    }
  }).sort((a, b) => {
    return compareHandsP2(a, b);
  }).map((hand, index, arr) => {
    // console.log(hand.hand, "  ", getHandOrderP2(hand.hand), "  ", hand.bet, " * ", index+1, (getHandOrderP2(hand.hand) === 4 && !hand.hand.includes("J") ? " < ---" : ""));
    return hand.bet * (index+1);
  }).reduce((prev, curr) => prev + curr, 0);
};

const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

run({
  part1: {
    tests: [
      {
        input,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
