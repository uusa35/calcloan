import React from 'react';
import {StyleSheet} from 'react-native';
import Actionsheet from 'react-native-enhanced-actionsheet';
import {text} from './constants';

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
      selected={periodTypeSelected}
      onOptionPress={(e) => {
        setPeriodTypeSelected(e);
        setPeriodTypeVisible(false);
      }}
      optionTextStyle={styles.normalText}
      onCancelPress={() => setPeriodTypeVisible(false)}
      title={'اختر'}
      cancelBtnText={'الغاء'}
      cancelTextStyle={styles.normalText}
    />
  );
};

export default LoanPeriodTypeActionSheet;

const styles = StyleSheet.create({
  normalText: {
    fontSize: text.large,
    textAlign: 'center',
  },
});
