import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const getHTML = (svgContent, style) => `
<html>
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
        height: 100${Platform.OS === 'ios' ? 'vh' : '%'};
        width: 100${Platform.OS === 'ios' ? 'vw' : '%'};
        overflow: hidden;
        object-fit: contain;
      }
    </style>
  </head>
  <body>
    ${svgContent}
  </body>
</html>
`;

export const SvgImage = ({ source: { uri }, style, containerStyle, onLoadStart, onLoadEnd }) => {
  const [svgContent, setSvgContent] = useState(null);
  const [loaded, setLoaded] = useState(false);
  let mounted = false;
  
  useEffect(() => {
    doFetch(uri);
    mounted = true;
    () => mounted = false;
  }, [uri]);
  
  async function doFetch() {
    if (uri) {
      onLoadStart && onLoadStart();
      if (uri.match(/^data:image\/svg/)) {
        const index = uri.indexOf('<svg');
        setSvgContent(uri.slice(index));
      } else {
        try {
          const res = await fetch(uri);
          const text = await res.text();
          setSvgContent(text);
        } catch (err) {
          console.error('got error', err);
        }
      }
      onLoadEnd && onLoadEnd();
    }
  }
  
  if (svgContent) {
    const flattenedStyle = StyleSheet.flatten(style) || {};
    const html = getHTML(svgContent, flattenedStyle);
    
    return (
      <View pointerEvents="none" style={[style, containerStyle]}
            renderToHardwareTextureAndroid={true}>
        <WebView
          originWhitelist={['*']}
          useWebKit
          style={{
            ...style,
            opacity: loaded ? 1 : 0,
            flex: 1,
          }}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          source={{ html }}
          javaScriptEnabled={false}
          onLoadEnd={(event) => !loaded && setLoaded(true)}
        />
      </View>
    );
  } else {
    return <View pointerEvents="none" style={[containerStyle, style]}
                 renderToHardwareTextureAndroid={true}/>;
  }
};
