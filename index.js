import React from 'react';
import { Image } from 'react-native';
import SvgImage from './SvgImage';

const MyImage = props =>
  props.source && (props.source.uri && props.source.uri.match('.svg')) ? (
    <SvgImage {...props} />
  ) : (
    <Image {...props} />
  );

export default MyImage;
