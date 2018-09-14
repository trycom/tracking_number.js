const isOdd = num => {
  return num % 2;
};

const s10Weights = [8, 6, 4, 2, 3, 5, 9, 7];

module.exports = {
  mod10: (sequence, checkDigit, extras) => {
    const { evens_multiplier, odds_multiplier } = extras;
    const total = sequence
      .split("")
      .map((c, i) => {
        let x = isNaN(c) ? (c.charCodeAt(0) - 3) % 10 : Number.parseInt(c);

        x *= isOdd(i) ? odds_multiplier : evens_multiplier;

        return x;
      })
      .reduce((a, b) => a + b);
    return 10 - (total % 10) === Number.parseInt(checkDigit);
  },
  mod7: (sequence, checkDigit) => {
    return sequence % 7 === Number.parseInt(checkDigit);
  },
  s10: (sequence, checkDigit) => {
    const total = sequence
      .split("")
      .map((c, i) => {
        return [c, s10Weights[i]];
      })
      .map(([a, b]) => a * b)
      .reduce((a, b) => a + b);

    const remainder = total % 11;
    let check;

    switch (remainder) {
      case 1:
        check = 0;
        break;
      case 0:
        check = 5;
        break;
      default:
        check = 11 - remainder;
        break;
    }

    return check === Number.parseInt(checkDigit);
  },
  sum_product_with_weightings_and_modulo: (
    sequence,
    checkDigit,
    extras = {}
  ) => {
    const { weightings, modulo1, modulo2 } = extras;
    const total = sequence
      .split("")
      .map((c, i) => {
        return [c, weightings[i]];
      })
      .map(([a, b]) => a * b)
      .reduce((a, b) => a + b);

    return (total % modulo1) % modulo2 === Number.parseInt(checkDigit);
  }
};
