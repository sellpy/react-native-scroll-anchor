/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {
  Button,
  Dimensions,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Anchor, useScrollAnchorContext } from '../../src';
import AnchorScrollView from '../../src/components/AnchorScrollView';

export default function App() {
  const width = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.container}>
      <AnchorScrollView
        onAnchorReachedY={(name) => console.log('Reached anchor: ' + name)}
        contentContainerStyle={{ width: width, paddingHorizontal: 20 }}
      >
        <ScrollToButtons />
        {new Array(100).fill(0).map((_, i) => (
          <Anchor key={i} name={'anchor' + i}>
            <View
              style={{
                backgroundColor: i % 2 ? 'red' : 'blue',
              }}
            >
              <Text style={{ fontSize: 20, paddingVertical: 8 }}>
                Element: {i}
              </Text>
            </View>
          </Anchor>
        ))}
      </AnchorScrollView>
    </SafeAreaView>
  );
}

const ScrollToButtons = () => {
  const [inputValue, setInputValue] = React.useState('0');

  const { scrollTo } = useScrollAnchorContext();

  return (
    <>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 100 }}
        value={inputValue}
        onChangeText={setInputValue}
        inputMode="numeric"
        onSubmitEditing={() => scrollTo('anchor' + inputValue)}
      />
      <Button
        title={'Scroll to element ' + inputValue}
        onPress={() => {
          scrollTo('anchor' + inputValue);
          Keyboard.dismiss();
        }}
        color={'blue'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
