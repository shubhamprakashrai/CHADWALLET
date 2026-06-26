import Svg, { Path } from 'react-native-svg';

type Props = {
  data: number[];
  width?: number;
  height?: number;
  /** override stroke; defaults to green/red based on first→last direction */
  color?: string;
};

/** Tiny trend line for token rows (bonus item from the spec). */
export function Sparkline({ data, width = 64, height = 28, color }: Props) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1);
  const d = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / span) * height;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
  const up = data[data.length - 1] >= data[0];
  const stroke = color ?? (up ? '#22E06B' : '#F6465D');
  return (
    <Svg width={width} height={height}>
      <Path d={d} stroke={stroke} strokeWidth={1.6} fill="none" strokeLinejoin="round" />
    </Svg>
  );
}
