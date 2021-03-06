export const parseArabicChar = (str) => {
  return Number(
    str
      .replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => d.charCodeAt(0) - 1632)
      .replace(/٫/g, '.'),
  );
};

export const getDecimals = (value) => {
  if (value % 1 != 0) {
    return value.toString().split('.')[1];
  }
  return 0;
};

export const numberWithCommas = (x) => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const convertYearToMonth = (loanTenure) => {
  if (this.state.loanTerm === LOAN_TERM_YEAR) {
    return this.resolveLoanTenure(loanTenure);
  } else {
    switch (loanTenure) {
      case LOAN_TENURE_YEARLY:
        return 12;
      case LOAN_TENURE_BI_ANNUALLY:
        return 6;
      case LOAN_TENURE_QUARTERLY:
        return 3;
      case LOAN_TENURE_MONTHLY:
        return 1;
      default:
        return;
    }
  }
};

export const resolveLoanTenure = (loanTenure) => {
  switch (loanTenure) {
    case LOAN_TENURE_YEARLY:
      return 1;
    case LOAN_TENURE_BI_ANNUALLY:
      return 2;
    case LOAN_TENURE_QUARTERLY:
      return 4;
    case LOAN_TENURE_MONTHLY:
      return 12;
    default:
      return;
  }
};

export const calculate = () => {
  Keyboard.dismiss();
  this.animate();

  let {loanAmount, interestRate, loanPeriod, loanTenure, loanTerm} = this.state;

  try {
    if (this.hasArabicChar(loanAmount)) {
      loanAmount = this.parseArabicChar(loanAmount);
    }
    if (this.hasArabicChar(interestRate)) {
      interestRate = this.parseArabicChar(interestRate);
    }
    if (this.hasArabicChar(loanPeriod)) {
      loanPeriod = this.parseArabicChar(loanPeriod);
    }

    const loanTenureConst = this.resolveLoanTenure(loanTenure);

    let loan,
      finalAmount,
      amountPayable,
      amountPayableReadable,
      interestAmount,
      totalInterestRate;

    const P = loanPeriod;
    const I = interestRate / 100; // convert 5 to 0.05
    const J = I / loanTenureConst;
    const n =
      loanTerm === LOAN_TERM_MONTH
        ? P / this.convertYearToMonth(loanTenure)
        : P * this.convertYearToMonth(loanTenure);
    const B = 1 - 1 / Math.pow(1 + J, n);

    if (interestRate == 0) {
      amountPayable = loanAmount;
      amountPayableReadable = this.numberWithCommas(loanAmount);
      interestAmount = 0;
      totalInterestRate = 0;
    } else {
      finalAmount = loanAmount * (J / B);
      amountPayable = finalAmount * n;

      const decimals = this.getDecimals(amountPayable);
      if (decimals.substring(0, 5) == '99999') {
        amountPayable = Math.round(amountPayable);
      }

      // console.log('amountPayable',amountPayable);
      amountPayableReadable = this.numberWithCommas(
        this.toDecimalPlace(amountPayable),
      );
      // console.log('amountPayableReadable',amountPayableReadable);
      interestAmount = this.toDecimalPlace(amountPayable - loanAmount);
      // console.log('interestAmount',interestAmount);
      totalInterestRate = (
        (parseFloat(interestAmount) / loanAmount) *
        100
      ).toFixed(2); // round to 10
      // console.log('totalInterestRate',totalInterestRate);
      interestAmount = this.numberWithCommas(interestAmount);
      // console.log('interestAmount',interestAmount);
    }

    loan = this.numberWithCommas(this.toDecimalPlace(amountPayable / n));
    // console.log('loan',loan);

    // if 6 decimals are number 9, then set to closest 1 ex:10999.99999999 = 11000

    return this.setState({
      loan: loan,
      interestAmount: interestAmount,
      amountPayable: amountPayableReadable,
      totalInterestRate: totalInterestRate,
      showResults: true,
    });
  } catch (error) {
    return alert(error);
  }
};
