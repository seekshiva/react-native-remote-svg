import React from 'react';
import { Image, Platform, View } from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import SvgImage from './SvgImage';


/**
 * @desc only in android add viewStyle in ios will ignore it
 * @param {*} viewStyle only in android add additonalStyle to View
 * @param {*} style you may need to update style for image also
 */
const MyImage = props => {
  const source = resolveAssetSource(props.source);
  if (source && (source.uri && source.uri.match('.svg'))) {
    const style = props.style || {};
    if (source.__packager_asset && typeof style !== 'number') {
      if (!style.width) {
        style.width = source.width;
      }
      if (!style.height) {
        style.height = source.height;
      }
    }
    return Platform.OS === 'android' 
    ? <View style={props.viewStyle}><SvgImage {...props} source={source} style={style} /></View>
    : <SvgImage {...props} source={source} style={style} />;
  } else {
    return <Image {...props} />;
  }
};

export default MyImage;
