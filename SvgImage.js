// @flow

import React, { Component } from "react";
import { View, WebView, Platform } from "react-native";

 //For better performance in Android platform
import WebAndroid from "react-native-webview-android";
const isAndroid = Platform.OS === "android";

const firstHtml =
  "<html><head><style>html, body { margin:0; padding:0; overflow:hidden; background-color: transparent; } svg { position:fixed; top:0; left:0; height:100%; width:100% }</style></head><body>";
const lastHtml = "</body></html>";

class SvgImage extends Component {
  state = { fetchingUrl: null, svgContent: null };
  componentDidMount() {
    this.doFetch(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.doFetch(nextProps);
  }
  doFetch = props => {
    let uri = props.source && props.source.uri;
    if (uri) {
      if (uri.match(/^data:image\/svg/)) {
        const index = uri.indexOf("<svg");
        this.setState({ fetchingUrl: uri, svgContent: uri.slice(index) });
      } else {
        console.log("fetching", uri);
        fetch(uri)
          .then(res => res.text())
          .then(text => {
            this.setState({ fetchingUrl: uri, svgContent: text });
          })
          .catch(err => {
            console.error("got error", err);
          });
      }
    }
  };
  render() {
    const props = this.props;
    const { svgContent } = this.state;
    const WView = isAndroid ? WebAndroid : WebView
    if (svgContent) {
      return (
        <View pointerEvents="none" style={[props.style, props.containerStyle]}>
          <WView
            scalesPageToFit={true}
            style={[
              {
                width: 200,
                height: 100,
                backgroundColor: "transparent"
              },
              props.style
            ]}
            scrollEnabled={false}
            source={{ html: `${firstHtml}${svgContent}${lastHtml}` }}
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
