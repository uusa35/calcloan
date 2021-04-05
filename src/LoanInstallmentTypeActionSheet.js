import React from 'react';
import {StyleSheet} from 'react-native';
import Actionsheet from 'react-native-enhanced-actionsheet';
import {text} from './constants';

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
      title={'اختر'}
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
    fontSize: text.large,
    textAlign: 'center',
  },
});
