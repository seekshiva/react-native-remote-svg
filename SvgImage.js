// @flow

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import {encode as btoa} from 'base-64';

const getHTML = (dataUrl, style) => `
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
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        background-image: url(${dataUrl});
        background-size: cover;
      }
    </style>
  </head>
  <body>
  </body>
</html>
`;

class SvgImage extends Component {
  state = { fetchingUrl: null, dataUrl: null };
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
      if (uri.match(/^data:/)) {
        this.setState({ fetchingUrl: uri, dataUrl: uri });
      } else {
        try {
          const res = await fetch(uri);
          const text = 'data:image/svg+xml;base64,' + btoa(await res.text());
          this.setState({ fetchingUrl: uri, dataUrl: text });
        } catch (err) {
          console.error('got error', err);
        }
      }
      props.onLoadEnd && props.onLoadEnd();
    }
  };
  render() {
    const props = this.props;
    const { dataUrl } = this.state;
    if (dataUrl) {
      const flattenedStyle = StyleSheet.flatten(props.style) || {};
      const html = getHTML(dataUrl, flattenedStyle);

      return (
        <View pointerEvents="none" style={[props.style, props.containerStyle]}>
          <WebView
            originWhitelist={['*']}
            scalesPageToFit={true}
            useWebKit={false}
            style={[
              {
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
              },
              props.style,
            ]}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            source={{ html }}
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
