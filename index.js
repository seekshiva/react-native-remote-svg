import React from 'react';
import { Image } from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import SvgImage from './SvgImage';

const MyImage = React.forwardRef((props, ref) => {
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
    return <SvgImage ref={ref} {...props} source={source} style={style} />;
  } else {
    return <Image ref={ref} {...props} />;
  }
});

export default MyImage;
