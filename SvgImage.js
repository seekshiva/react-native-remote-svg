import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
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

const injectedJavaScript = `window.ReactNativeWebView.postMessage('pageLoaded'); true;`;

export const SvgImage = ({
  source: { uri },
  style,
  containerStyle,
  onLoadStart,
  onLoadEnd,
}) => {
  const [didMount, setDidMount] = useState(false);
  const [svgContent, setSvgContent] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setDidMount(true);
    doFetch(uri);
    return () => setDidMount(false);
  }, [uri]);

  if (!didMount) {
    return null;
  }

  async function doFetch() {
    if (uri) {
      onLoadStart && onLoadStart();
      if (uri.match(/^data:image\/svg/)) {
        const index = uri.indexOf("<svg");
        setSvgContent(uri.slice(index));
      } else {
        try {
          const res = await fetch(uri);
          const text = await res.text();
          setSvgContent(text);
        } catch (err) {
          console.error("got error", err);
        }
      }
      onLoadEnd && onLoadEnd();
    }
  }
  if (svgContent) {
    const flattenedStyle = StyleSheet.flatten(style) || {};
    const html = getHTML(svgContent, flattenedStyle);
    return (
      <View pointerEvents="none" style={[style, containerStyle]}>
        <WebView
          originWhitelist={["*"]}
          scalesPageToFit
          useWebKit
          style={[
            {
              width: 200,
              height: 100,
              backgroundColor: "transparent",
            },
            style,
          ]}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          source={{ html }}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled
          onMessage={(event) => {
            if (event.nativeEvent.data === "pageLoaded") {
              setLoaded(true);
            }
          }}
        />
      </View>
    );
  } else {
    return <View pointerEvents="none" style={[containerStyle, style]} />;
  }
};
