/**
 * @format
 */
import {useCallback, useMemo, useState} from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import {getAllLevels, getLevelById} from './src/content/levelsRegistry';
import {getDailySeed, getEndlessSeedForRun} from './src/seed/challengeSeeds';
import {shareScoreCard} from './src/share/shareCard';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const [endlessRun, setEndlessRun] = useState(0);
  const daily = useMemo(() => getDailySeed(), []);
  const endlessSeed = useMemo(
    () => getEndlessSeedForRun(endlessRun, 'dev-profile'),
    [endlessRun],
  );
  const levels = useMemo(() => getAllLevels(), []);
  const exampleLevel = getLevelById(1);

  const onShareDemo = useCallback(async () => {
    await shareScoreCard({
      score: 42,
      seed: daily.seed,
      timestampIso: new Date().toISOString(),
      mode: 'daily',
    });
  }, [daily.seed]);

  const bg = isDark ? '#0b0b0b' : '#f5f5f5';
  const fg = isDark ? '#f2f2f2' : '#111';

  return (
    <View style={[styles.root, {backgroundColor: bg, paddingTop: insets.top + 8}]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, {color: fg}]}>LoopForge · Content (APO-18)</Text>
        <Text style={[styles.caption, {color: fg}]}>
          {levels.length} level specs (B1: 1–5, B2: 6–20) + daily/endless seeds + share card
        </Text>
        <View style={styles.block}>
          <Text style={[styles.heading, {color: fg}]}>Daily (UTC {daily.dateKey})</Text>
          <Text style={[styles.mono, {color: fg}]}>seed: {daily.seed >>> 0}</Text>
        </View>
        <View style={styles.block}>
          <Text style={[styles.heading, {color: fg}]}>Endless</Text>
          <Text style={[styles.mono, {color: fg}]}>
            run {endlessRun} → seed: {endlessSeed >>> 0}
          </Text>
          <Button
            title="Next endless run (deterministic chain)"
            onPress={() => setEndlessRun(r => r + 1)}
            color={isDark ? '#7cb7ff' : '#0070f3'}
          />
        </View>
        {exampleLevel ? (
          <View style={styles.block}>
            <Text style={[styles.heading, {color: fg}]}>Sample level</Text>
            <Text style={{color: fg}}>
              {exampleLevel.id}. {exampleLevel.name} — {exampleLevel.hazards.length} hazards
            </Text>
          </View>
        ) : null}
        <View style={styles.block}>
          <Text style={[styles.heading, {color: fg}]}>Share card</Text>
          <Text style={{color: fg, marginBottom: 8}}>
            Opens system share sheet with score, seed, timestamp (local export path).
          </Text>
          <Button title="Share demo (daily)" onPress={onShareDemo} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  scroll: {paddingHorizontal: 16, paddingBottom: 32, gap: 8},
  title: {fontSize: 20, fontWeight: '600'},
  caption: {opacity: 0.85, marginBottom: 8},
  heading: {fontSize: 16, fontWeight: '600', marginBottom: 4},
  mono: {fontFamily: Platform.select({ios: 'Menlo', default: 'monospace'}), fontSize: 14},
  block: {marginBottom: 12, gap: 4},
});

export default App;
