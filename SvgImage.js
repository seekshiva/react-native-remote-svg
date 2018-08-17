// @flow

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, WebView, StyleSheet } from 'react-native';
const fetchingDebug = require("debug")("react-native-remote-svg:SvgImage:fetch");
const fetchResultDebug = require("debug")("react-native-remote-svg:SvgImage:fetch:result");
import Promise from 'bluebird';
Promise.config({ cancellation: true }); // Need to explicitly enable this feature

const firstHtml =
  '<html><head><style>html, body { margin:0; padding:0; overflow:hidden; background-color: transparent; } svg { position:fixed; top:0; left:0; height:100%; width:100% }</style></head><body>';
const lastHtml = '</body></html>';

class SvgImage extends Component {

  static propTypes = {
    source: PropTypes.shape({
        uri: PropTypes.string.isRequired
      }).isRequired,
    containerStyle: PropTypes.oneOfType([
        PropTypes.instanceOf(StyleSheet).isRequired,
        PropTypes.object.isRequired,
      ]),
    style: PropTypes.oneOfType([
        PropTypes.instanceOf(StyleSheet).isRequired,
        PropTypes.object.isRequired,
    ]),
  }

  state = {
    svgContent: null,
    fetchingPromise: null,
  };

  componentDidMount() {
    this.doFetch();
  }

  componentWillUnmount() {
    const { fetchingPromise } = this.state || {};
    if(fetchingPromise) fetchingPromise.cancel();
  }

  componentDidUpdate(prevProps) {
    const { source:oldSource } = prevProps || {};
    const { uri:oldUri } = oldSource || {};
    const { source:newSource } = this.props || {};
    const { uri:newUri } = newSource || {};
    if(oldUri !== newUri) this.doFetch();
  }

  doFetch() {
    const { source } = this.props || {};
    const { uri } = source || {};
    if (uri) {
      if (uri.match(/^data:image\/svg/)) {
        const index = uri.indexOf('<svg');
        this.setState({ svgContent: uri.slice(index) });
      } else {
        fetchingDebug('Fetching SVG from %s', uri);
        this.setState(({fetchingPromise:previousFetch}) => ({ fetchingPromise:
          Promise.resolve(fetch(uri))
            .call("text")
            .then(text => this.setState({ svgContent: text }))
            .timeout(1000 * 60, `SVG URI fetch timed out: ${uri}`)
            .catch(e => console.error(`Error fetching SVG URI: ${e.message||e}`, {uri, e}))
            .return((previousFetch && previousFetch.isPending()) ? previousFetch : null) // Ensure we resolve/cancel previous fetch
        }))
      }
    }
  }

  render() {
    const props = this.props || {};
    const { svgContent } = this.state || {};
    const hasSvgContent = Boolean(svgContent);
      return (
        <View pointerEvents="none" style={[props.containerStyle, hasSvgContent ? {} : props.style]}>
          { hasSvgContent && <WebView
            originWhitelist={['*']}
            scalesPageToFit={true}
            style={[
              {
                width: 200,
                height: 100,
                backgroundColor: 'transparent',
              },
              props.style,
            ]}
            scrollEnabled={false}
            source={{ html: `${firstHtml}${svgContent}${lastHtml}` }}
          /> }
        </View>
      );
  }
}

export default SvgImage;
