import React, {useMemo, useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import codePush from 'react-native-code-push';
import {colors, text, width, height, trans, iconSizes} from './constants';
import {Icon, Input} from 'react-native-elements';
import LoanInstallmentTypeActionSheet from './LoanInstallmentTypeActionSheet';
import {numberWithCommas, parseArabicChar, toDecimalPlace} from './helpers';
import LoanPeriodTypeActionSheet from './LoanPeriodTypeActionSheet';
import {isNull, filter, last, isEmpty} from 'lodash';
import {isNumeric} from 'lodash-contrib';

const App = () => {
  const [loanAmount, setLoanAmount] = useState(1000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanPeriod, setLoanPeriod] = useState(1);
  const [interestAmount, setInterestAmount] = useState(null);
  const [totalInterestRate, setTotalInterestRate] = useState(null);
  const [amountPayable, setAmountPayable] = useState(null);
  const [installment, setInstallment] = useState(null); // --> loan
  const [showResults, setShowResults] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [periodTypeVisible, setPeriodTypeVisible] = useState(false);
  const [periodTypeSelected, setPeriodTypeSelected] = useState(null);
  const [periodTypeOptions, setPeriodTypeOptions] = useState([
    {id: 0, label: trans.MONTH, value: 'MONTH'},
    {id: 1, label: trans.YEAR, value: 'YEAR'},
  ]);

  const [installmentTypeVisible, setInstallmentTypeVisible] = useState(false);
  const [installmentTypeSelected, setInstallmentTypeSelected] = useState(null);
  const [installmentTypeOptions, setInstallmentTypeOptions] = useState([
    {id: 0, label: trans.YEARLY, yearToPeriod: 1, yearToMonth: 12},
    {id: 1, label: trans.BI_ANNUALLY, yearToPeriod: 2, yearToMonth: 6},
    {id: 2, label: trans.QUARTERLY, yearToPeriod: 4, yearToMonth: 3},
    {id: 3, label: trans.MONTHLY, yearToPeriod: 12, yearToMonth: 1},
  ]);

  useMemo(() => {
    if (
      !isNull(periodTypeSelected) &&
      periodTypeSelected.id &&
      !isNull(loanPeriod)
    ) {
      if (periodTypeSelected.value === 'MONTH') {
        setInstallmentTypeOptions(
          filter(installmentTypeOptions, (o) => o.yearToMonth <= loanPeriod),
        );
      } else {
        if (loanPeriod <= 1) {
          setInstallmentTypeOptions(
            filter(installmentTypeOptions, (o) => o.yearToPeriod > loanPeriod),
          );
        } else {
          setInstallmentTypeOptions(installmentTypeOptions);
        }
      }
    }
    setInstallmentTypeSelected(last(installmentTypeOptions));
  }, [periodTypeSelected, loanPeriod]);

  useMemo(() => {
    setPeriodTypeSelected(last(periodTypeOptions));
    setInstallmentTypeSelected(last(installmentTypeOptions));
  }, []);

  const reset = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanPeriod('');
    setPeriodTypeSelected(null);
    setInstallmentTypeSelected(null);
    setShowResults(false);
    setIsReady(false);
  };

  useMemo(() => {
    if (
      isNumeric(loanAmount) &&
      loanAmount > 0 &&
      isNumeric(interestRate) &&
      interestRate > 0 &&
      isNumeric(loanPeriod) &&
      loanPeriod > 0 &&
      !isEmpty(periodTypeSelected) &&
      !isEmpty(installmentTypeSelected)
    ) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [
    loanAmount,
    interestRate,
    loanPeriod,
    periodTypeSelected,
    installmentTypeSelected,
  ]);

  const calculate = () => {
    if (isReady) {
      setShowResults(true);
      if (interestRate == 0) {
        setAmountPayable(numberWithCommas(loanAmount));
        setInterestAmount(0);
        setTotalInterestRate(0);
      } else {
        const percentageInterestRate = interestRate / 100;
        const J = percentageInterestRate / installmentTypeSelected.yearToPeriod;
        const n =
          periodTypeSelected.value === 'MONTH'
            ? loanPeriod / installmentTypeSelected.yearToMonth
            : loanPeriod * installmentTypeSelected.yearToPeriod;
        const B = 1 - 1 / Math.pow(1 + J, n);
        const payable = parseFloat(loanAmount * (J / B) * n).toFixed(2);
        setAmountPayable(numberWithCommas(payable));
        const intAmount = toDecimalPlace(payable - loanAmount);
        setTotalInterestRate((parseFloat(intAmount) / loanAmount) * 100);
        setInterestAmount(numberWithCommas(intAmount));
        setInstallment(numberWithCommas(toDecimalPlace(payable / n)));
      }
    } else {
      setShowResults(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#1b1b1b',
      }}>
      <StatusBar
        animated={true}
        backgroundColor="#284d43"
        barStyle={'light-content'}
      />
      <ScrollView
        contentContainerStyle={{
          paddingTop: '10%',
          padding: 10,
          justifyContent: 'center',
        }}
        contentInset={{bottom: iconSizes.huge}}
        horizontal={false}
        scrollEnabled={true}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          behavior={'padding'}
          keyboardVerticalOffset={iconSizes.huge}
          style={{}}>
          <Input
            placeholder={trans.loanAmount}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            label={trans.loanAmount}
            labelStyle={[styles.titleLabelStyle]}
            value={loanAmount}
            textContentType={'telephoneNumber'}
            shake={true}
            keyboardType="numeric"
            onChangeText={(text) => setLoanAmount(parseArabicChar(text))}
          />
          <Input
            placeholder={trans.interestRate}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            label={trans.interestRate}
            labelStyle={[styles.titleLabelStyle]}
            value={interestRate}
            textContentType={'telephoneNumber'}
            shake={true}
            keyboardType="numeric"
            onChangeText={(text) => setInterestRate(parseArabicChar(text))}
            />
          <Input
            placeholder={trans.loanPeriod}
            inputContainerStyle={[styles.inputContainerStyle]}
            inputStyle={styles.inputStyle}
            label={trans.loanPeriod}
            labelStyle={[styles.titleLabelStyle]}
            value={loanPeriod}
            textContentType={'telephoneNumber'}
            shake={true}
            keyboardType="numeric"
            onChangeText={(text) => setLoanPeriod(parseArabicChar(text))}
            rightIcon={() => (
              <TouchableOpacity
                onPress={() => {
                  setPeriodTypeVisible(!periodTypeVisible);
                }}
                style={{
                  flexDirection: 'row',
                  height: 50,
                  alignItems: 'center',
                  padding: 5,
                  width: 100,
                    borderLeftWidth : 1,
                    borderLeftColor : colors.mainLight
                }}>
                <Text style={{paddingLeft: 10, color : colors.white, fontSize : text.large}}>
                  {periodTypeSelected
                    ? periodTypeSelected.label
                    : trans.periodType}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View
            style={{paddingLeft: 10, paddingRight: 10, flex: 1, width: '100%'}}>
            <Text style={styles.titleLabelStyle}>{trans.installmentType}</Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                backgroundColor: 'transparent',
                  borderWidth : 0.8,
                  borderColor : colors.mainLight,
                flex: 1,
                height: 50,
                // paddingLeft: 20,
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
              onPress={() => {
                setInstallmentTypeVisible(!installmentTypeVisible);
              }}>
              <Text
                style={{
                  fontSize: text.large,
                    color : colors.mainLight,
                  paddingLeft: 15,
                }}>
                {!isEmpty(installmentTypeSelected)
                  ? installmentTypeSelected.label
                  : trans.installmentType}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 20,
              paddingTop: 20,
              flex: 1,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              disabled={!isReady}
              onPress={() => calculate()}
              style={{
                flex: 0.45,
                  borderRadius: 60,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: !isReady ? 'grey' : colors.main,
                borderWidth: 0.5,
                borderColor: 'lightgrey',
                padding: 20,
              }}>
              <Text style={[styles.normalText, {fontSize: text.medium}]}>
                {trans.calcYourLoan}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => reset()}
              style={{
                flex: 0.45,
                borderRadius: 60,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                borderWidth: 0.5,
                borderColor: 'lightgrey',
                backgroundColor: colors.main,
                flexDirection: 'row',
                padding: 20,
              }}>
              <Text style={[styles.normalText, {fontSize: text.medium}]}>
                {trans.reset}
              </Text>
              <Icon
                name="repeat"
                type="font-awesome"
                color="white"
                size={iconSizes.smallest}
              />
            </TouchableOpacity>
          </View>

          {showResults && (
            <View
              style={{
                borderWidth: 1,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                borderColor: 'white',
                marginLeft: 10,
                marginRight: 10,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingLeft: 10,
                  paddingRight: 10,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  height: 50,
                }}>
                <View style={{flex: 0.4}}>
                  <Text style={styles.normalText}>{trans.installment}</Text>
                </View>
                <View style={{flex: 0.6, flexDirection: 'row'}}>
                  <Text style={[styles.normalText, {paddingRight: 15}]}>:</Text>
                  <Text style={styles.normalText}>{installment}</Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingLeft: 10,
                  paddingRight: 10,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  height: 50,
                }}>
                <View style={{flex: 0.4}}>
                  <Text style={[styles.normalText]}>{trans.interest}</Text>
                </View>
                <View style={{flex: 0.6, flexDirection: 'row'}}>
                  <Text style={[styles.normalText, {paddingRight: 15}]}>:</Text>
                  <Text style={styles.normalText}>{interestAmount}</Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingLeft: 10,
                  paddingRight: 10,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  height: 50,
                }}>
                <View style={{flex: 0.4}}>
                  <Text style={[styles.normalText]}>{trans.amountPayable}</Text>
                </View>
                <View style={{flex: 0.6, flexDirection: 'row'}}>
                  <Text style={[styles.normalText, {paddingRight: 15}]}>:</Text>
                  <Text style={styles.normalText}>{amountPayable}</Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingLeft: 10,
                  paddingRight: 10,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  height: 50,
                }}>
                <View style={{flex: 0.4}}>
                  <Text style={[styles.normalText]}>{trans.realInterest}</Text>
                </View>
                <View style={{flex: 0.6, flexDirection: 'row'}}>
                  <Text style={[styles.normalText, {paddingRight: 15}]}>:</Text>
                  <Text style={styles.normalText}>% {totalInterestRate}</Text>
                </View>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
        <LoanInstallmentTypeActionSheet
          installmentTypeVisible={installmentTypeVisible}
          setInstallmentTypeVisible={setInstallmentTypeVisible}
          setInstallmentTypeSelected={setInstallmentTypeSelected}
          installmentTypeSelected={installmentTypeSelected}
          installmentTypeOptions={installmentTypeOptions}
          setInstallmentTypeOptions={setInstallmentTypeOptions}
        />
        <LoanPeriodTypeActionSheet
          periodTypeOptions={periodTypeOptions}
          periodTypeSelected={periodTypeSelected}
          periodTypeVisible={periodTypeVisible}
          setPeriodTypeSelected={setPeriodTypeSelected}
          setPeriodTypeOptions={setPeriodTypeOptions}
          setPeriodTypeVisible={setPeriodTypeVisible}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default codePush({
  checkFrequency: codePush.CheckFrequency.IMMEDIATE,
})(App);

const styles = StyleSheet.create({
  inputStyle: {
    // fontFamily: text.font,
    textAlign: 'right',
    height: 50,
    color: colors.white,
    // paddingLeft: 20,
  },
  inputContainerStyle: {
    borderWidth: 1,
    borderColor: colors.mainLight,
    borderRadius: 2,
    paddingLeft: 15,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  titleLabelStyle: {
    // fontFamily: text.font,
    fontSize: text.medium,
    paddingRight: 10,
    textAlign: 'left',
    paddingBottom: 10,
    color: colors.mainLight,
    fontWeight: 'bold',
  },
  normalText: {
    // fontFamily: text.font,
    fontSize: text.large,
    textAlign: 'left',
    color: colors.white,
    fontWeight: 'bold',
  },
});
