import React from "react";
import { Image } from "react-native";
import SvgImage from "./SvgImage";

const MyImage = (props) => {
  const resolveAssetSource = Image.resolveAssetSource;
  const source = resolveAssetSource(props.source);
  if (source && source.uri && source.uri.match(".svg")) {
    const style = props.style || {};
    if (source.__packager_asset && typeof style !== "number") {
      if (!style.width) {
        style.width = source.width;
      }
      if (!style.height) {
        style.height = source.height;
      }
    }
    return <SvgImage {...props} source={source} style={style} />;
  } else {
    return <Image {...props} />;
  }
};

export default MyImage;
