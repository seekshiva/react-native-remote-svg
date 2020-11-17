// @flow

import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

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

const SvgImage = (props) => {
  const [fetchingUrl, setFetchingUrl] = useState(null);
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    doFetch();
  }, []);

  const doFetch = async () => {
    let uri = props.source && props.source.uri;
    if (uri) {
      props.onLoadStart && props.onLoadStart();
      if (uri.match(/^data:image\/svg/)) {
        const index = uri.indexOf("<svg");
        setFetchingUrl(uri);
        setSvgContent(uri.slice(index));
      } else {
        try {
          const res = await fetch(uri);
          const text = await res.text();
          setFetchingUrl(uri);
          setSvgContent(text);
        } catch (err) {
          console.error("got error", err);
        }
      }
      props.onLoadEnd && props.onLoadEnd();
    }
  };
  if (svgContent) {
    const flattenedStyle = StyleSheet.flatten(props.style) || {};
    const html = getHTML(svgContent, flattenedStyle);

    return (
      <View pointerEvents="none" style={[props.style, props.containerStyle]}>
        <WebView
          originWhitelist={["*"]}
          scalesPageToFit={true}
          useWebKit={false}
          style={[
            {
              width: 200,
              height: 100,
              backgroundColor: "transparent",
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
      <View pointerEvents="none" style={[props.containerStyle, props.style]} />
    );
  }
};

export default SvgImage;
