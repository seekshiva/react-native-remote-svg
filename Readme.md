# react-native-remote-svg

`Image` component that supports svg filetype in
[React Native](https://facebook.github.io/react-native).

## Installation

Using [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/):

    $ yarn add react-native-remote-svg

`Image` component in react-native doesn't yet support svg file type. This
package gives you an `Image` component that supports both svg and png file
types.

It doesn't require any native code setup. No need to do any `react-native link`.
Just import and use!

## Breaking Changes:

This project follows semantic versioning. Here are the breaking changes:

- **v2.0.0**
  - As of React Native 0.57, WebView has been decoupled and moved to a separate
    project. This update imports WebView from react-native-webview and can only
    be used in projects using RN 0.57 or later.

## Usage:

You need to import `Image` from this package instead of from react-native

```diff
- import { Image } from 'react-native'
+ import Image from 'react-native-remote-svg'
```

and you can use this Image component like you normally would:

```js
import Image from 'react-native-remote-svg';

<Image
  source={{ uri: 'https://example.com/my-pic.svg' }}
  style={{ width: 200, height: 532 }}
/>;
```

supports data uri as well:

```js
import Image from 'react-native-remote-svg';

<Image
  source={{
    uri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px"  viewBox="0 0 100 100">
      <ellipse data-custom-shape="ellipse" cx="50" cy="50" rx="50" ry="50" fill="green"  stroke="#00FF00" stroke-width ="2" />
    </svg>`,
  }}
  style={{ width: 100, height: 100 }}
/>;
```

**Note:** When you load an image from the internet, you need to specify
width/height of the image (default to 100, 100).

When you load a local image, width/height are not mandatory:

```js
<Image source={require('./image.svg')} />
```

You can load normal jpg/png images as well

```js
<Image
  source={{ uri: 'https://example.com/my-other-pic.png' }
  style={{ width: 100, height: 120}}
/>
```

## Feature parity:

Here are the list of react-native Image features that are supported:

- [x] source
- [x] style
- [ ] blurRadius
- [ ] onLayout
- [ ] onLoad
- [x] onLoadEnd
- [ ] onLoadStart
- [ ] resizeMode
- [ ] onError
- [ ] testID
- [ ] resizeMethod
- [ ] accessibilityLabel
- [ ] accessible
- [ ] capInsets
- [ ] defaultSource
- [ ] onPartialLoad
- [ ] onProgress

The goal is to have full feature parity with react-native's Image and then add
this component directly into react-native itself.

## Issues

If you find a bug, please file an issue on
[our issue tracker on GitHub](https://facebook.github.io/react-native-remote-svg/issues).
