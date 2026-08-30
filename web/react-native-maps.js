import React from 'react';
import { View } from 'react-native';

const Stub = ({ children, style }) => <View style={style}>{children}</View>;

export const Marker = Stub;
export const Polygon = Stub;
export const Polyline = Stub;
export const Heatmap = Stub;
export const Circle = Stub;
export const PROVIDER_GOOGLE = 'google';

export default Stub;
