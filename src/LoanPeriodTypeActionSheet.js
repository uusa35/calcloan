import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Actionsheet from 'react-native-enhanced-actionsheet';
import {colors, text} from './constants';

const LoanPeriodTypeActionSheet = ({
  periodTypeOptions,
  periodTypeSelected,
  periodTypeVisible,
  setPeriodTypeSelected,
  setPeriodTypeOptions,
  setPeriodTypeVisible,
}) => {
  return (
    <Actionsheet
      visible={periodTypeVisible}
      data={periodTypeOptions}
      title={'اختر نوع المدة'}
      selected={periodTypeSelected}
      onOptionPress={(e) => {
        setPeriodTypeSelected(e);
        setPeriodTypeVisible(false);
      }}
      optionTextStyle={styles.normalText}
      titleStyle={styles.normalText}
      onCancelPress={() => setPeriodTypeVisible(false)}
      cancelBtnText={'الغاء'}
      cancelTextStyle={styles.normalText}
    />
  );
};

export default LoanPeriodTypeActionSheet;

const styles = StyleSheet.create({
  normalText: {
    fontFamily: text.font,
    fontSize: text.medium,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
});
