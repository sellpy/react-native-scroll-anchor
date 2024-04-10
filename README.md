# @sellpy/react-native-scroll-anchor ⚓️

[![npm version](https://badge.fury.io/js/react-native-scroll-anchor.svg)](https://badge.fury.io/js/react-native-scroll-anchor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Hooks and utilities to simplify scrolling to elements (anchors) in React Native**.

- Zero dependencies 📦
- Lightweight and fast ⚡️
- Easy to use 🚀

## Installation

```sh
npm install @sellpy/react-native-scroll-anchor
```

## Quickstart

```tsx
import React, { useRef } from 'react';
import { Button, ScrollView, TextInput, View } from 'react-native';
import {
  Anchor,
  ScrollAnchorProvider,
  useScrollAnchor,
} from '@sellpy/react-native-scroll-anchor';

export default function App() {
  const scrollRef = React.useRef<ScrollView>(null);

  const methods = useScrollAnchor(scrollRef);
  const { scrollTo, onScroll } = methods;

  return (
    <ScrollAnchorProvider {...methods}>
      <Button onPress={scrollTo('books')} title="View books" />
      <ScrollView onScroll={onScroll} scrollEventThrottle={32} ref={scrollRef}>
        <Anchor name="movies">
          <MovieList />
        </Anchor>
        <Anchor name="books">
          <BookList />
        </Anchor>
      </ScrollView>
    </ScrollAnchorProvider>
  );
}
```

---

## Hooks

### useScrollAnchor

The `useScrollAnchor` hook is used to register and unregister anchors, scroll to anchors, and listen to scroll events.

```tsx
import { useScrollAnchor } from '@sellpy/react-native-scroll-anchor';

export function MyComponent() {
  const ref = useRef(null);
  const { register, unregister, scrollTo, timeoutOnScroll, onScroll } =
    useScrollAnchor(ref, {
      onAnchorReachedX: (name) =>
        console.log('Reached anchor on x-axis:', name),
      onAnchorReachedY: (name) =>
        console.log('Reached anchor on y-axis:', name),
    });

  return (
    <ScrollView
      onScroll={onScroll}
      scrollEventThrottle={32}
      ref={scrollRef}
    ></ScrollView>
  );
}
```

**Args**

| Name    | Type                    | Default | Description                         |
| ------- | ----------------------- | ------- | ----------------------------------- |
| ref     | `RefObject<ScrollView>` |         | The ref of the ScrollView component |
| options | `ScrollAnchorOptions`   | `{}`    | Options for the hook                |

**Type `ScrollAnchorOptions`**

| Name             | Type                     | Default | Description                                                                                                                                      |
| ---------------- | ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| throttle         | `number`                 | `200`   | Throttles onAnchorReachedX, onAnchorReachedY callbacks per anchor name as well as the scrollTo method.                                           |
| offsetX          | `number`                 | `0`     | Offset for the x-axis when scrolling to an anchor.                                                                                               |
| offsetY          | `number`                 | `0`     | Offset for the y-axis when scrolling to an anchor.                                                                                               |
| onAnchorReachedX | `(name: string) => void` |         | Callback when an anchor is reached on the x-axis. Requires binding of `onScroll` between referenced `ScrollView` and returned `onScroll` method. |
| onAnchorReachedY | `(name: string) => void` |         | Callback when an anchor is reached on the y-axis. Same requriements as for onAnchorReachedX                                                      |
| keepInBounds     | `boolean`                | `false` | If true, we make sure onAnchorReachedX and onAnchorReachedY are called when scrolling. They will be called with the nearest anchor.              |

**Returns**

| Name            | Type                                                       | Description                                                                                                                                                             |
| --------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| register        | `(name: string, ref: RefObject<NativeComponent>) => void`  | Register an anchor with a name and a ref.                                                                                                                               |
| unregister      | `(name: string) => void`                                   | Unregister an anchor with a name.                                                                                                                                       |
| scrollTo        | `(name: string) => void`                                   | Scroll to an anchor by name.                                                                                                                                            |
| timeoutOnScroll | `(timeMs: string) => void`                                 | Timeout onScroll manually, this won't cause onAnchorReachedX or onAnchorReachedY to be called.                                                                          |
| onScroll        | `(event: NativeSyntheticEvent<NativeScrollEvent>) => void` | The onScroll event handler. Pass this to the ScrollView component. **NOTE: this is required for if onScrollAnchorReachedX or onScrollAnchorReachedY should be called.** |
| anchorRefs      | `Record<string, RefObject<NativeComponent>>`               | The refs of all registered anchors, name is anchor name povided                                                                                                         |

---

### useAnchorRef

Another way to register an anchor is by using the `useAnchorRef` hook. This hook is useful when you want to register an anchor ref without using the `Anchor` component.

This component requires the `ScrollAnchorProvider` to be present in the component tree.

```tsx
import { useAnchorRef } from '@sellpy/react-native-scroll-anchor';

export function MyComponent() {
  const ref = useAnchorRef('item');

  return (
    <View ref={ref}>
      <Text>Awesome Item</Text>
    </View>
  );
```

**Args**

| Name | Type     | Default | Description            |
| ---- | -------- | ------- | ---------------------- |
| name | `string` |         | The name of the anchor |

**Returns**

| Name | Type                    | Description           |
| ---- | ----------------------- | --------------------- |
| ref  | `RefObject<NativeView>` | The ref of the anchor |

## Components

### AnchorProvider

Sets up a provider enabling usage of `<Anchor />` and `useAnchorRef` in the component tree.

```tsx
import {
  ScrollAnchorProvider,
  useScrollAnchor,
} from '@sellpy/react-native-scroll-anchor';
import { ScrollView } from 'react-native';

export function MyComponent() {
  const scrollViewRef = useRef<ScrollView>(null);
  const methods = useScrollAnchor(ref);

  return (
    <ScrollAnchorProvider {...methods}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={methods.onScroll}
        scrollEventThrottle={16}
      >
        <MyAnchoredComponent />
      </ScrollView>
    </ScrollAnchorProvider>
  );
}
```

**Props**

| Name       | Type                          | Default | Description                                       |
| ---------- | ----------------------------- | ------- | ------------------------------------------------- |
| children   | `ReactNode`                   |         | The children to render                            |
| ...methods | `ReturnType<useScrollAnchor>` |         | Provide all methods returned form useScrollAnchor |

### Anchor

The `Anchor` component is used to wrap a component that you want to scroll to.

This component requires the `ScrollAnchorProvider` to be present in the component tree.

```tsx
import { Anchor } from '@sellpy/react-native-scroll-anchor';

<Anchor name="item">
  <MyAnchoredComponent />
</Anchor>;
```

**Props**

| Name | Type     | Default | Description                                                                       |
| ---- | -------- | ------- | --------------------------------------------------------------------------------- |
| name | `string` |         | The name of the anchor. You can scroll to this anchor by calling scrollTo(<name>) |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---
