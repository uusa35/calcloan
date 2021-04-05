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
  Dimensions,
} from 'react-native';
import codePush from 'react-native-code-push';
import {colors, text, trans, iconSizes} from './constants';
import {Icon, Input} from 'react-native-elements';
import LoanInstallmentTypeActionSheet from './LoanInstallmentTypeActionSheet';
import {numberWithCommas, parseArabicChar, toDecimalPlace} from './helpers';
import LoanPeriodTypeActionSheet from './LoanPeriodTypeActionSheet';
import {isNull, filter, last, isEmpty, first} from 'lodash';
import {isNumeric} from 'lodash-contrib';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanPeriod, setLoanPeriod] = useState('');
  const [interestAmount, setInterestAmount] = useState(null);
  const [totalInterestRate, setTotalInterestRate] = useState(null);
  const [amountPayable, setAmountPayable] = useState(null);
  const [installment, setInstallment] = useState(null);
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
  const [
    fixedInstallmentTypeOptions,
    setFixedInstallmentTypeOptions,
  ] = useState([
    {id: 3, label: trans.MONTHLY, yearToPeriod: 12, yearToMonth: 1},
    {id: 2, label: trans.QUARTERLY, yearToPeriod: 4, yearToMonth: 3},
    {id: 1, label: trans.BI_ANNUALLY, yearToPeriod: 2, yearToMonth: 6},
    {id: 0, label: trans.YEARLY, yearToPeriod: 1, yearToMonth: 12},
  ]);
  const [installmentTypeOptions, setInstallmentTypeOptions] = useState(
    fixedInstallmentTypeOptions,
  );
  const {width, height} = Dimensions.get('window');

  useMemo(() => {
    if (!isNull(periodTypeSelected)) {
      if (periodTypeSelected.value == 'MONTH') {
        setInstallmentTypeOptions(
          filter(
            fixedInstallmentTypeOptions,
            (o) => o.yearToMonth <= loanPeriod,
          ),
        );
      } else {
        if (loanPeriod <= 12) {
          setInstallmentTypeOptions(
            filter(
              fixedInstallmentTypeOptions,
              (o) => o.yearToMonth <= loanPeriod,
            ),
          );
        } else {
          setInstallmentTypeOptions(fixedInstallmentTypeOptions);
        }
      }
    }
    setInstallmentTypeSelected(first(installmentTypeOptions));
  }, [periodTypeSelected, loanPeriod]);

  useMemo(() => {
    setPeriodTypeSelected(last(periodTypeOptions));
    setInstallmentTypeSelected(first(fixedInstallmentTypeOptions));
  }, []);

  const reset = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanPeriod('');
    setPeriodTypeSelected(last(periodTypeOptions));
    setInstallmentTypeSelected(first(fixedInstallmentTypeOptions));
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
        const payable = parseFloat(loanAmount * (J / B) * n).toFixed(3);
        setAmountPayable(numberWithCommas(payable));
        const intAmount = toDecimalPlace(payable - loanAmount);
        setTotalInterestRate(
          (parseFloat(parseFloat(intAmount) / loanAmount) * 100).toFixed(2),
        );
        setInterestAmount(numberWithCommas(intAmount));
        setInstallment(numberWithCommas(toDecimalPlace(payable / n)));
      }
    } else {
      setShowResults(false);
    }
  };

  useEffect(() => {
    codePush.sync({installMode: codePush.InstallMode.IMMEDIATE});
    codePush.checkForUpdate().then((update) => {
      if (!update) {
      } else {
      }
    });
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  const handleLoanPeriod = (period) => {
    if (period <= 1 && periodTypeSelected.id === 1) {
      setLoanPeriod(12 * period);
    } else {
      setLoanPeriod(period);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 10,
        justifyContent: 'flex-start',
        // minHeight: height,
        //   height : '100%',
        backgroundColor: '#1b1b1b',
      }}
      style={{backgroundColor: '#1b1b1b'}}
      // contentInset={{bottom: iconSizes.medium}}
      horizontal={false}
      scrollEnabled={true}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      <StatusBar
        animated={true}
        backgroundColor="#284d43"
        barStyle={'light-content'}
      />
      <SafeAreaView />
      <KeyboardAvoidingView
        behavior={'padding'}
        // keyboardVerticalOffset={iconSizes.huge}
      >
        <View style={{paddingTop: 20}}>
          <Input
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            label={trans.loanAmount}
            labelStyle={[styles.titleLabelStyle]}
            value={loanAmount}
            textContentType={'telephoneNumber'}
            shake={true}
            maxLength={15}
            keyboardType="numeric"
            onChangeText={(text) =>
              setLoanAmount(parseFloat(parseArabicChar(text)))
            }
          />
          <Input
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            label={trans.interestRate}
            labelStyle={[styles.titleLabelStyle]}
            value={interestRate}
            textContentType={'telephoneNumber'}
            shake={true}
            maxLength={7}
            keyboardType="numeric"
            onChangeText={(text) =>
              setInterestRate(parseFloat(parseArabicChar(text)))
            }
          />
          <Input
            inputContainerStyle={[styles.inputContainerStyle]}
            inputStyle={styles.inputStyle}
            label={trans.loanPeriod}
            labelStyle={[styles.titleLabelStyle]}
            value={loanPeriod}
            textContentType={'telephoneNumber'}
            shake={true}
            maxLength={5}
            keyboardType="numeric"
            onChangeText={(text) =>
              handleLoanPeriod(parseFloat(parseArabicChar(text)))
            }
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
                  borderLeftWidth: 1,
                  borderLeftColor: colors.mainLight,
                }}>
                <Text
                  style={{
                    paddingLeft: 10,
                    color: colors.white,
                    fontSize: text.large,
                  }}>
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
                borderWidth: 0.8,
                borderColor: colors.mainLight,
                flex: 1,
                height: 50,
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
              onPress={() => {
                setInstallmentTypeVisible(!installmentTypeVisible);
              }}>
              <Text
                style={{
                  fontSize: text.large,
                  color: colors.white,
                  paddingLeft: 15,
                }}>
                {!isEmpty(installmentTypeSelected)
                  ? installmentTypeSelected.label
                  : first(fixedInstallmentTypeOptions).label}
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
                padding: 20,
              }}>
              <Text
                style={[
                  styles.normalText,
                  {fontSize: text.medium, color: colors.white},
                ]}>
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
                backgroundColor: colors.main,
                flexDirection: 'row',
                padding: 20,
              }}>
              <Text
                style={[
                  styles.normalText,
                  {fontSize: text.medium, color: colors.white},
                ]}>
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
                height: height / 4,
                maxHeight: height / 4,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                borderColor: colors.mainLight,
                marginLeft: 10,
                marginRight: 10,
                padding: 5,
              }}>
              <View style={styles.resultRow}>
                <View style={{flex: 0.4}}>
                  <Text style={styles.normalText}>{trans.installment}</Text>
                </View>
                <View style={{flex: 0.6, flexDirection: 'row'}}>
                  <Text style={[styles.normalText, {paddingRight: 5}]}>:</Text>
                  <Text style={styles.resultText}>{installment}</Text>
                </View>
              </View>

              <View style={styles.resultRow}>
                <View style={{flex: 0.4}}>
                  <Text style={[styles.normalText]}>{trans.interest}</Text>
                </View>
                <View style={{flex: 0.6, flexDirection: 'row'}}>
                  <Text style={[styles.normalText, {paddingRight: 5}]}>:</Text>
                  <Text style={styles.resultText}>{interestAmount}</Text>
                </View>
              </View>

              <View style={styles.resultRow}>
                <View style={{flex: 0.4}}>
                  <Text style={[styles.normalText]}>{trans.amountPayable}</Text>
                </View>
                <View style={{flex: 0.6, flexDirection: 'row'}}>
                  <Text style={[styles.normalText, {paddingRight: 5}]}>:</Text>
                  <Text style={styles.resultText}>{amountPayable}</Text>
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
                  <Text style={[styles.normalText, {paddingRight: 5}]}>:</Text>
                  <Text style={styles.resultText}>% {totalInterestRate}</Text>
                </View>
              </View>
            </View>
          )}
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
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default codePush({
  checkFrequency: codePush.CheckFrequency.IMMEDIATE,
})(App);

const styles = StyleSheet.create({
  inputStyle: {
    textAlign: 'right',
    height: 50,
    color: colors.white,
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
    fontSize: text.medium,
    paddingRight: 10,
    textAlign: 'left',
    paddingBottom: 10,
    color: colors.mainLight,
    fontWeight: 'bold',
  },
  normalText: {
    fontSize: text.medium,
    textAlign: 'left',
    color: colors.mainLight,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: text.large,
    textAlign: 'left',
    color: colors.white,
    fontWeight: 'bold',
  },
  resultRow: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
    borderBottomColor: colors.mainLight,
    borderBottomWidth: 0.5,
  },
});
