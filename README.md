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
      onAnchorReachedX: (key) => console.log('Reached anchor on x-axis:', key),
      onAnchorReachedY: (key) => console.log('Reached anchor on y-axis:', key),
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

| Name             | Type                    | Default | Description                                                                                                                             |
| ---------------- | ----------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| throttle         | `number`                | `200`   | Throttles onAnchorReachedX, onAnchorReachedY callbacks per anchor key as well as the scrollTo method.                                   |
| offsetX          | `number`                | `0`     | Offset for the x-axis when scrolling to an anchor.                                                                                      |
| offsetY          | `number`                | `0`     | Offset for the y-axis when scrolling to an anchor.                                                                                      |
| onAnchorReachedX | `(key: string) => void` |         | Callback when an anchor is reached on the x-axis.                                                                                       |
| onAnchorReachedY | `(key: string) => void` |         | Callback when an anchor is reached on the y-axis.                                                                                       |
| keepInBounds     | `boolean`               | `false` | If true, we make sure onAnchorReachedX and onAnchorReachedY are called when scrolling. They will be called with the nearest anchor key. |

**Returns**

| Name            | Type                                                       | Description                                                                                    |
| --------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| register        | `(key: string, ref: RefObject<NativeComponent>) => void`   | Register an anchor with a key and a ref.                                                       |
| unregister      | `(key: string) => void`                                    | Unregister an anchor with a key.                                                               |
| scrollTo        | `(key: string) => void`                                    | Scroll to an anchor by key.                                                                    |
| timeoutOnScroll | `(timeMs: string) => void`                                 | Timeout onScroll manually, this won't cause onAnchorReachedX or onAnchorReachedY to be called. |
| onScroll        | `(event: NativeSyntheticEvent<NativeScrollEvent>) => void` | The onScroll event handler. Pass this to the ScrollView component.                             |
| anchorRefs      | `Record<string, RefObject<NativeComponent>>`               | The refs of all registered anchors, key is anchor name povided                                 |

---

### useAnchorRef

Anchor ref could be registered using the `useAnchorRef` hook. This hook is useful when you want to register an anchor ref without using the `Anchor` component.

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

| Name | Type     | Default | Description           |
| ---- | -------- | ------- | --------------------- |
| key  | `string` |         | The key of the anchor |

**Returns**

| Name | Type                    | Description           |
| ---- | ----------------------- | --------------------- |
| ref  | `RefObject<NativeView>` | The ref of the anchor |

## Components

### AnchorProvider

```tsx
import {
  ScrollAnchorProvider,
  useScrollAnchor,
} from '@sellpy/react-native-scroll-anchor';

export function MyComponent() {
  const methods = useScrollAnchor();

  return (
    <ScrollAnchorProvider {...methods}>
      <MyAnchoredComponent />
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
