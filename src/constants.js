import React from 'react';
import {Dimensions} from 'react-native';
import {FIRST_AR_FONT} from './../app.json';

export const colors = {
  main: '#0e916a',
  black: 'black',
  white: 'white',
};

export const {height, width} = Dimensions.get('window');

export const text = {
  smallest: 5,
  smaller: 10,
  small: 12,
  medium: 15,
  large: 20,
  xlarge: 25,
  bold: 'bold',
  font: FIRST_AR_FONT,
};

export const iconSizes = {
  tiny: 10,
  smallest: 15,
  smaller: 25,
  small: 30,
  medium: 40,
  large: 50,
  larger: 60,
  largest: 70,
  huge: 300,
};

export const trans = {
  YEARLY: 'سنوي',
  BI_ANNUALLY: 'نصف سنوي',
  QUARTERLY: 'ربع سنوي',
  MONTHLY: 'شهري',
  YEAR: 'سنة',
  MONTH: 'شهر',
  loanAmount: 'قيمة القرض',
  interestRate: 'نسبة الفائدة (٪)',
  installmentType: 'نوع القسط',
  amountPayable: 'المديونية',
  interestAmount: 'قيمة الفائدة',
  loan: 'القرض',
  installment: 'القسط',
  interest: 'الفائدة',
  realInterest: 'النسبة الفعلية',
  calcYourLoan: 'احسب قرضك',
  reset: 'إعادة تعيين',
  periodType: 'نوع المدة',
  loanPeriod: 'مدة القرض',
};
