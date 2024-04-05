# @sellpy/react-native-scroll-anchor ⚓️

[![npm version](https://badge.fury.io/js/react-native-scroll-anchor.svg)](https://badge.fury.io/js/react-native-scroll-anchor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**⚠️ This package is not production ready**

**Hooks and utilities to simplify scrolling to elements in React Native**.

- Zero dependencies 📦
- Lightweight and fast ⚡️
- Easy to use 🚀

## Installation

```sh
npm install @sellpy/react-native-scroll-anchor
```

## Usage

```tsx
import { Button, ScrollView, TextInput, View } from 'react-native';
import {
  Anchor,
  ScrollAnchorProvider,
  useScrollAnchor,
} from '@sellpy/react-native-scroll-anchor';

export default function App() {
  const scrollRef = React.useRef<ScrollView>(null);
  const methods = useScrollAnchor(scrollRef);
  const { scrollTo } = methods;

  return (
    <>
      <Button onPress={scrollTo('item')} title="Scroll to Awesome Item" />
      <ScrollView
        onScroll={methods.onScroll}
        scrollEventThrottle={32}
        ref={scrollRef}
      >
        <ScrollAnchorProvider {...methods}>
          <Anchor name="item">
            <AwesomeItem />
          </Anchor>
        </ScrollAnchorProvider>
      </ScrollView>
    </>
  );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---
