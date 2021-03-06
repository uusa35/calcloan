import React, {useMemo, useState, useEffect, createRef} from 'react';
import Actionsheet from 'react-native-enhanced-actionsheet';
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
import {parseArabicChar} from './helpers';
import LoanPeriodTypeActionSheet from './LoanPeriodTypeActionSheet';

const one = createRef();
const tow = createRef();

let COUNT = 0;
const OPTIONS = [
  {id: COUNT++, label: 'option #' + COUNT},
  {id: COUNT++, label: 'option #' + COUNT},
];

const App = () => {
  const [loanAmount, setloanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanPeriod, setLoanPeriod] = useState('');
  const [loanTerm, setloanTerm] = useState('');

  const [amountPayable, setamountPayable] = useState('');
  const [interestAmount, setinterestAmount] = useState('');
  const [loan, setloan] = useState('');
  const [showResults, setshowResults] = useState(false);
  const [iterator, setiterator] = useState('');

  const [periodTypeVisible, setPeriodTypeVisible] = useState(false);
  const [periodTypeSelected, setPeriodTypeSelected] = useState(null);
  const [periodTypeOptions, setPeriodTypeOptions] = useState([
    {id: 0, label: trans.MONTH},
    {id: 1, label: trans.YEAR},
  ]);

  const [installmentTypeVisible, setInstallmentTypeVisible] = useState(false);
  const [installmentTypeSelected, setInstallmentTypeSelected] = useState(null);
  const [installmentTypeOptions, setInstallmentTypeOptions] = useState([
    {id: 0, label: trans.YEARLY},
    {id: 1, label: trans.BI_ANNUALLY},
    {id: 2, label: trans.QUARTERLY},
    {id: 3, label: trans.MONTHLY},
  ]);

  console.log('loanAmount', loanAmount);
  console.log('interestRate', interestRate);
  console.log('loanPeriod', loanPeriod);
  console.log('periodTypeSelected', periodTypeSelected);
  console.log('installmentTypeSelected', installmentTypeSelected);

  const reset = () => {
    setloanAmount('');
    setInterestRate('');
    setLoanPeriod('');
    setPeriodTypeSelected(null);
    setInstallmentTypeSelected(null);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}>
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
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
          behavior={'height'}
          keyboardVerticalOffset={iconSizes.huge}
          style={{}}>
          <Input
            placeholder={trans.loanAmount}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            label={trans.loanAmount}
            labelStyle={[styles.titleLabelStyle]}
            shake={true}
            keyboardType="numeric"
            onChangeText={(text) => setloanAmount(parseArabicChar(text))}
            leftIcon={() => (
              <Icon
                name="account-cash"
                type="material-community"
                size={iconSizes.smaller}
              />
            )}
          />
          <Input
            placeholder={trans.interestRate}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            label={trans.interestRate}
            labelStyle={[styles.titleLabelStyle]}
            shake={true}
            keyboardType="numeric"
            onChangeText={(text) => setInterestRate(parseArabicChar(text))}
            leftIcon={() => (
              <Icon
                name="percent"
                type="material-community"
                size={iconSizes.smaller}
              />
            )}
          />
          <Input
            placeholder={trans.loanPeriod}
            inputContainerStyle={[styles.inputContainerStyle]}
            inputStyle={styles.inputStyle}
            label={trans.loanPeriod}
            labelStyle={[styles.titleLabelStyle]}
            shake={true}
            keyboardType="numeric"
            onChangeText={(text) => setLoanPeriod(parseArabicChar(text))}
            leftIcon={() => (
              <Icon
                name="cash-register"
                type="font-awesome-5"
                size={iconSizes.smaller}
              />
            )}
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
                }}>
                <Icon
                  name="calendar-clock"
                  type="material-community"
                  size={iconSizes.smaller}
                />
                <Text style={{fontFamily: text.font, paddingLeft: 10}}>
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
                backgroundColor: 'white',
                flex: 1,
                height: 50,
                paddingLeft: 20,
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
              onPress={() => {
                setInstallmentTypeVisible(!installmentTypeVisible);
              }}>
              <Icon
                name="cash-remove"
                type="material-community"
                size={iconSizes.smaller}
              />
              <Text
                style={{
                  fontFamily: text.font,
                  fontSize: text.large,
                  paddingLeft: 15,
                }}>
                {installmentTypeSelected
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
              disabled={!showResults}
              style={{
                flex: 0.4,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: !showResults ? 'grey' : colors.main,
                padding: 20,
              }}>
              <Text style={[styles.normalText, {fontSize: text.medium}]}>
                {trans.calcYourLoan}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => reset()}
              style={{
                flex: 0.4,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.main,
                padding: 20,
              }}>
              <Text style={[styles.normalText, {fontSize: text.medium}]}>
                {trans.reset}
              </Text>
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
                <View style={{flex: 0.6}}>
                  <Text style={styles.normalText}> {`  123.456  `}:</Text>
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
                <View style={{flex: 0.6}}>
                  <Text style={styles.normalText}> {`  123.456  `}:</Text>
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
                <View style={{flex: 0.6}}>
                  <Text style={styles.normalText}> {`  123.456  `}:</Text>
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
                <View style={{flex: 0.6}}>
                  <Text style={styles.normalText}> {`  123.456  `}:</Text>
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
    fontFamily: text.font,
    textAlign: 'right',
    height: 50,
    color: colors.black,
    paddingLeft: 20,
  },
  inputContainerStyle: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 2,
    paddingLeft: 15,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  titleLabelStyle: {
    fontFamily: text.font,
    fontSize: text.medium,
    paddingRight: 10,
    textAlign: 'left',
    paddingBottom: 10,
    color: colors.white,
    fontWeight: 'bold',
  },
  normalText: {
    fontFamily: text.font,
    fontSize: text.large,
    textAlign: 'left',
    color: colors.white,
    fontWeight: 'bold',
  },
});
