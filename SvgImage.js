// @flow

import React, { Component } from 'react';
import { View, WebView } from 'react-native';


const lastHtml = '</body></html>';

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
        const index = uri.indexOf('<svg');
        this.setState({ fetchingUrl: uri, svgContent: uri.slice(index) });
      } else {
        console.log('fetching', uri);
        fetch(uri)
          .then(res => res.text())
          .then(text => {
            this.setState({ fetchingUrl: uri, svgContent: text });
          })
          .catch(err => {
            console.error('got error', err);
          });
      }
    }
  };

  createFirstHtml(height,width){
      return '<html><head><style>html, body { margin:0; padding:0; overflow:hidden; background-color: transparent; } svg {' +
          ' position:fixed; top:0; left:0; height:'+ height + '; width:'+ width + ' }</style></head><body>';
  }

  render() {
    const props = this.props;
    const { svgContent } = this.state;
    const firstHtml = this.createFirstHtml(props.style.height,props.style.width);
    if (svgContent) {
      return (
        <View pointerEvents="none" style={[props.style, props.containerStyle]}>
          <WebView
            scalesPageToFit={true}
            style={[
              {
                width: props.style.width,
                height: props.style.height,
                backgroundColor: 'transparent',
              },
              props.style,
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
