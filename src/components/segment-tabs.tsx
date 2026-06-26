import { Pressable, ScrollView, Text, View } from 'react-native';

type Props = {
  tabs: readonly string[];
  value: string;
  onChange: (tab: string) => void;
  /** 'pill' = filled green active pill (range selectors); 'text' = green active label (feed tabs) */
  variant?: 'pill' | 'text';
  scroll?: boolean;
};

export function SegmentTabs({ tabs, value, onChange, variant = 'pill', scroll }: Props) {
  const Row = scroll ? ScrollView : View;
  const rowProps = scroll
    ? { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerClassName: 'gap-2 px-1' }
    : { className: 'flex-row items-center gap-2' };

  return (
    <Row {...(rowProps as object)}>
      {tabs.map((tab) => {
        const active = tab === value;
        if (variant === 'pill') {
          return (
            <Pressable
              key={tab}
              onPress={() => onChange(tab)}
              className={`rounded-full px-4 py-1.5 ${active ? 'bg-primary' : 'bg-transparent'}`}>
              <Text className={`text-sm font-semibold ${active ? 'text-primary-fg' : 'text-text-secondary'}`}>
                {tab}
              </Text>
            </Pressable>
          );
        }
        return (
          <Pressable key={tab} onPress={() => onChange(tab)} className="flex-row items-center gap-1.5 py-1.5">
            {active && <View className="h-1.5 w-1.5 rounded-full bg-primary" />}
            <Text className={`text-[15px] font-semibold ${active ? 'text-primary' : 'text-text-secondary'}`}>
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </Row>
  );
}
