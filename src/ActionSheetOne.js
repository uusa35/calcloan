import React, {createRef} from 'react';
import {View, Text} from 'react-native';
import ActionSheet from 'react-native-actionsheet';

const one = createRef();
const options = [
  'Cancel',
  'Apple',
  <Text style={{color: 'yellow'}}>Wafa</Text>,
  'Watermelon',
  <Text style={{color: 'red'}}>lara</Text>,
];

const ActionSheetOne = () => {
  const showActionSheet = () => {
    one.current?.show();
  };
  return (
    <View>
      <ActionSheet
        // ref={(o) => (this.ActionSheet = o)}
        ref={one}
        title={
          <Text style={{color: '#000', fontSize: 18}}>
            Which one do you like?
          </Text>
        }
        options={options}
        cancelButtonIndex={0}
        destructiveButtonIndex={4}
        onPress={(index) => {
          /* do something */
        }}
      />
    </View>
  );
};

export default ActionSheetOne;
