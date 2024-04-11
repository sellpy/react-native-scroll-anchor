# @sellpy/react-native-scroll-anchor ⚓️

[![npm version](https://badge.fury.io/js/%40sellpy%2Freact-native-scroll-anchor.svg)](https://badge.fury.io/js/%40sellpy%2Freact-native-scroll-anchor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


**Hooks and utilities to simplify scrolling to elements (anchors) in React Native**.

- Easy to use 🚀
- Lightweight and fast ⚡️
- Zero dependencies 📦

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
      <Button onPress={() => scrollTo('books')} title="View books" />
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

| Name    | Type                                        | Default | Description                         |
| ------- | ------------------------------------------- | ------- | ----------------------------------- |
| ref     | `RefObject<ScrollView>`                     |         | The ref of the ScrollView component |
| options | [ScrollAnchorOptions](#scrollanchoroptions) | `{}`    | Options                             |

**Returns** [ScrollAnchorMethods](#scrollanchormethods)

---

### useAnchorRef

Another way to register an anchor is by using the [`useAnchorRef`](#useanchorref) hook. This hook is useful when you want to register an anchor ref without using the [`<Anchor/>`](#anchor) component.

This component requires the [`ScrollAnchorProvider`](#scrollanchorprovider) to be present in the component tree.

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

**Returns** `RefObject<NativeView>`

## Components

### ScrollAnchorProvider

Sets up a provider enabling usage of [`<Anchor />`](#anchor) and [`useAnchorRef`](#useanchorref) in the component tree.

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

| Name       | Type                                        | Default | Description                                       |
| ---------- | ------------------------------------------- | ------- | ------------------------------------------------- |
| children   | `ReactNode`                                 |         | The children to render                            |
| ...methods | [ScrollAnchorMethods](#scrollanchormethods) |         | Provide all methods returned form useScrollAnchor |

### Anchor

The `<Anchor/>` component is used to wrap a component that you want to scroll to.

This component requires the [`ScrollAnchorProvider`](#scrollanchorprovider) to be present in the component tree.

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

## Types

### ScrollAnchorOptions

```ts
interface ScrollAnchorOptions {
  /* Throttles onAnchorReachedX, onAnchorReachedY callbacks per anchor name as well as the scrollTo method. The number is in MS */
  throttle?: number /* default: 200 (ms) */;

  /* Offset for the x-axis when scrolling to an anchor */
  offsetX?: number /* default: 0 */;

  /* Offset for the y-axis when scrolling to an anchor */
  offsetY?: number /* default: 0 */;

  /* Callback when an anchor is reached on the x-axis. Requires binding of `onScroll` between referenced `ScrollView` and returned `onScroll` method */
  onAnchorReachedX?: (name: string) => void;

  /* Callback when an anchor is reached on the y-axis. Same requriements as for onAnchorReachedX */
  onAnchorReachedY?: (name: string) => void;

  /* If true, we make sure onAnchorReachedX and onAnchorReachedY are called when scrolling. They will be called with the nearest anchor */
  keepInBounds?: boolean /* default: false */;
}
```

### ScrollAnchorMethods

```ts
interface ScrollAnchorMethods {
  /* Register an anchor with a name and a ref. */
  register: (name: string, ref: React.RefObject<NativeComponent>) => void;

  /* Unregister an anchor by name. */
  unregister: (name: string) => void;

  /* Scroll to an anchor by name. */
  scrollTo: (name: string) => void;

  /* Timeout onScroll manually, this won't cause onAnchorReachedX or onAnchorReachedY to be called. */
  timeoutOnScroll: (timeMs: number) => void;

  /* The onScroll event handler. Pass this to the ScrollView component. **NOTE: this is required for if onScrollAnchorReachedX or onScrollAnchorReachedY should be called.** */
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

  /* The refs of all registered anchors, key is anchor name povided */
  anchorRefs: Record<string, React.RefObject<NativeComponent>>;
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---
