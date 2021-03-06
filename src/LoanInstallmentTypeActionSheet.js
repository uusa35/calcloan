import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import Actionsheet from 'react-native-enhanced-actionsheet';
import {colors, text} from './constants';

const LoanInstallmentTypeActionSheet = ({
  installmentTypeVisible,
  setInstallmentTypeVisible,
  installmentTypeSelected,
  setInstallmentTypeSelected,
  installmentTypeOptions,
  setInstallmentTypeOptions,
}) => {
  return (
    <Actionsheet
      visible={installmentTypeVisible}
      data={installmentTypeOptions}
      title={'اختر نوع القسط'}
      selected={installmentTypeSelected}
      onOptionPress={(e) => {
        setInstallmentTypeSelected(e);
        setInstallmentTypeVisible(false);
      }}
      optionTextStyle={styles.normalText}
      titleStyle={styles.normalText}
      onCancelPress={() => setInstallmentTypeVisible(false)}
      cancelBtnText={'الغاء'}
      cancelTextStyle={styles.normalText}
    />
  );
};

export default LoanInstallmentTypeActionSheet;

const styles = StyleSheet.create({
  normalText: {
    fontFamily: text.font,
    fontSize: text.medium,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
});
