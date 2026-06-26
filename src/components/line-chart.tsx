import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

type Props = {
  data: number[];
  height?: number;
  color?: string;
  /** show a soft gradient fill under the line */
  fill?: boolean;
};

/**
 * Full-width price chart used on token detail, portfolio and KOL screens.
 * Auto-sizes to its container width. A real interactive chart (scrub/markers)
 * is a Phase 5 bonus — this draws the smooth line + area fill.
 */
export function LineChart({ data, height = 180, color, fill = true }: Props) {
  const [width, setWidth] = useState(0);
  const up = data.length >= 2 ? data[data.length - 1] >= data[0] : true;
  const stroke = color ?? (up ? '#22E06B' : '#F6465D');

  let line = '';
  let area = '';
  if (width > 0 && data.length >= 2) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const stepX = width / (data.length - 1);
    const pts = data.map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / span) * (height - 8) - 4;
      return [x, y] as const;
    });
    line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    area = `${line} L${width},${height} L0,${height} Z`;
  }

  return (
    <View style={{ height }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={stroke} stopOpacity={0.22} />
              <Stop offset="1" stopColor={stroke} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          {fill && <Path d={area} fill="url(#chartFill)" />}
          <Path d={line} stroke={stroke} strokeWidth={2} fill="none" strokeLinejoin="round" />
        </Svg>
      )}
    </View>
  );
}
