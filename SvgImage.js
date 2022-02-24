// @flow

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const getHTML = (svgContent, style) => `
<html data-key="key-${style.height}-${style.width}">
  <head>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        background-color: transparent;
      }
      svg {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    ${svgContent}
  </body>
</html>
`;

const injectedJavaScript = `window.ReactNativeWebView.postMessage('pageLoaded'); true;`;

class SvgImage extends Component {
  state = { fetchingUrl: null, svgContent: null, loaded: false };
  componentDidMount() {
    this.doFetch(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const prevUri = this.props.source && this.props.source.uri;
    const nextUri = nextProps.source && nextProps.source.uri;

    if (nextUri && prevUri !== nextUri) {
      this.doFetch(nextProps);
    }
  }
  doFetch = async props => {
    let uri = props.source && props.source.uri;
    if (uri) {
      props.onLoadStart && props.onLoadStart();
      if (uri.match(/^data:image\/svg/)) {
        const index = uri.indexOf('<svg');
        this.setState({ fetchingUrl: uri, svgContent: uri.slice(index) });
      } else {
        try {
          const res = await fetch(uri);
          const text = await res.text();
          this.setState({ fetchingUrl: uri, svgContent: text });
        } catch (err) {
          console.error('got error', err);
        }
      }
      props.onLoadEnd && props.onLoadEnd();
    }
  };
  webViewMessageHandler = event => {
    if (event.nativeEvent.data === 'pageLoaded') {
      this.setState({
        loaded: true,
      });
    }
  };
  render() {
    const props = this.props;
    const { svgContent, loaded } = this.state;
    if (svgContent) {
      const flattenedStyle = StyleSheet.flatten(props.style) || {};
      const html = getHTML(svgContent, flattenedStyle);
      const webViewStyle = loaded
        ? [
            {
              width: 200,
              height: 100,
            },
            props.style,
          ]
        : { flex: 0, height: 0, opacity: 0 };

      return (
        <View pointerEvents="none" style={[props.style, props.containerStyle]}
          renderToHardwareTextureAndroid={true}>
          <WebView
            originWhitelist={['*']}
            useWebKit
            style={webViewStyle}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            source={{ html }}
            injectedJavaScript={injectedJavaScript}
            javaScriptEnabled
            onMessage={this.webViewMessageHandler}
          />
        </View>
      );
    } else {
      return (
        <View
          pointerEvents="none"
          style={[props.containerStyle, props.style]}
        />
      );
    }
  }
}

export default SvgImage;
