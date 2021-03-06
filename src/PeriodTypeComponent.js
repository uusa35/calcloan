import React, {createRef} from 'react';
import {Text, View} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
const actionSheetRef = createRef();

const PeriodTypeComponent = ({ref}) => {
  return (
    <ActionSheet ref={ref}>
      <View>
        <Text>YOUR CUSTOM COMPONENT INSIDE THE ACTIONSHEET</Text>
      </View>
    </ActionSheet>
  );
};

export default PeriodTypeComponent;
