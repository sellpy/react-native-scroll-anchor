/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {
  Button,
  Dimensions,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Anchor, ScrollAnchorProvider, useScrollAnchor } from '../../src';

export default function App() {
  const width = Dimensions.get('window').width;
  const scrollRef = React.useRef<ScrollView>(null);
  const methods = useScrollAnchor(scrollRef);

  const [inputValue, setInputValue] = React.useState('0');

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 100 }}
        value={inputValue}
        onChangeText={setInputValue}
        inputMode="numeric"
        onSubmitEditing={() => methods.scrollTo('anchor' + inputValue)}
      />
      <Button
        title={'Scroll to element ' + inputValue}
        onPress={() => {
          methods.scrollTo('anchor' + inputValue);
          Keyboard.dismiss();
        }}
        color={'blue'}
      />
      <ScrollView
        onScroll={methods.onScroll}
        scrollEventThrottle={32}
        contentContainerStyle={{ width: width, paddingHorizontal: 20 }}
        ref={scrollRef}
      >
        <ScrollAnchorProvider {...methods}>
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
        </ScrollAnchorProvider>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
