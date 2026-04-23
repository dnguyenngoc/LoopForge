import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import { buildLevelFromSeed } from '../game/level';
import { appendStrokeToPath } from '../game/pathStroke';
import { validatePathPrefix } from '../game/pathValidation';
import { advanceRun, beginRun, createInitialSim } from '../game/simulation';
import type { CellCoord } from '../game/types';

const GRID_ROWS = 8;
const GRID_COLS = 8;
const MAX_BOARD = 360;

function cellKey(c: CellCoord) {
  return `${c.row},${c.col}`;
}

type Props = { seed: number };

export function PathGameScreen({ seed }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const level = useMemo(() => buildLevelFromSeed(seed), [seed]);
  const [path, setPath] = useState<CellCoord[]>([]);
  const [sim, setSim] = useState(createInitialSim);
  const boardSize = Math.min(MAX_BOARD, windowWidth - 32);
  const cellW = boardSize / GRID_COLS;
  const cellH = boardSize / GRID_ROWS;

  const toCell = useCallback(
    (x: number, y: number): CellCoord | null => {
      if (x < 0 || y < 0 || x > boardSize || y > boardSize) {
        return null;
      }
      const col = Math.floor(x / cellW);
      const row = Math.floor(y / cellH);
      if (row < 0 || col < 0 || row >= GRID_ROWS || col >= GRID_COLS) {
        return null;
      }
      return { row, col };
    },
    [boardSize, cellH, cellW],
  );

  const liveValidation = useMemo(() => {
    if (path.length === 0) {
      return null;
    }
    return validatePathPrefix(level, path);
  }, [level, path]);

  const onClear = useCallback(() => {
    setPath([]);
    setSim(createInitialSim());
  }, []);

  const onRun = useCallback(() => {
    const r = beginRun(level, path);
    setSim(r.snapshot);
  }, [level, path]);

  useEffect(() => {
    if (sim.phase !== 'running') {
      return;
    }
    const id = setInterval(() => {
      setSim(prev => advanceRun(prev, path.length));
    }, 90);
    return () => clearInterval(id);
  }, [path.length, sim.phase]);

  const pathSet = useMemo(() => new Set(path.map(cellKey)), [path]);

  const drag = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: evt => {
          if (sim.phase === 'running') {
            return;
          }
          setSim(createInitialSim());
          const { locationX, locationY } = evt.nativeEvent;
          const cell = toCell(locationX, locationY);
          if (cell) {
            setPath(appendStrokeToPath(level, [], cell));
          }
        },
        onPanResponderMove: evt => {
          if (sim.phase === 'running') {
            return;
          }
          const { locationX, locationY } = evt.nativeEvent;
          const cell = toCell(locationX, locationY);
          if (!cell) {
            return;
          }
          setPath(prev => {
            if (prev.length === 0) {
              return appendStrokeToPath(level, prev, cell);
            }
            return appendStrokeToPath(level, prev, cell);
          });
        },
        onPanResponderRelease: () => {
          // Keep path; user taps Run
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- toCell changes with layout
    [level, sim.phase, toCell],
  );

  // Fix: use `drag` not panResponder for the board - I duplicated panResponder; remove old ref
  // Wire board with drag
  return (
    <View style={styles.root}>
      <Text style={styles.title}>APO-17 – One-line path + run</Text>
      <Text style={styles.sub}>seed={seed}</Text>
      <View
        style={[styles.board, { width: boardSize, height: boardSize }]}
        {...drag.panHandlers}
      >
        {level.grid.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((cell, c) => {
              const inPath = pathSet.has(`${r},${c}`);
              const base =
                cell === 'wall'
                  ? styles.wall
                  : cell === 'start'
                    ? styles.start
                    : cell === 'goal'
                      ? styles.goal
                      : styles.empty;
              return (
                <View
                  key={`${r}-${c}`}
                  style={[
                    styles.cell,
                    { width: cellW, height: cellH },
                    base,
                    inPath && styles.pathLine,
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
      {path.length > 0 &&
        liveValidation &&
        !liveValidation.ok &&
        sim.phase !== 'running' &&
        sim.phase !== 'success' && (
          <Text style={styles.hint}>
            (preview) {liveValidation.reason.replace(/_/g, ' ')}
          </Text>
        )}
      {sim.phase === 'fail' && sim.lastFailReason && (
        <Text style={styles.fail}>Run failed: {sim.lastFailReason.replace(/_/g, ' ')}</Text>
      )}
      {sim.phase === 'success' && <Text style={styles.ok}>Success – path is valid and complete.</Text>}
      {sim.phase === 'running' && (
        <Text style={styles.run}>
          Running… step {sim.runStepIndex + 1} / {path.length || 0}
        </Text>
      )}
      <View style={styles.rowButtons}>
        <Text style={styles.btn} onPress={onRun}>
          Run
        </Text>
        <Text style={styles.btn} onPress={onClear}>
          Clear
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: '#0b1020' },
  title: { color: '#e8f0ff', fontSize: 18, fontWeight: '600' },
  sub: { color: '#7f8a9b', marginBottom: 8 },
  board: { borderColor: '#2a3a5c', borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row' },
  cell: { borderWidth: StyleSheet.hairlineWidth, borderColor: '#1e2a40' },
  empty: { backgroundColor: '#121a2d' },
  wall: { backgroundColor: '#2d3548' },
  start: { backgroundColor: '#1b7f4a' },
  goal: { backgroundColor: '#1e5c9e' },
  pathLine: { backgroundColor: '#b8f7c1' },
  hint: { color: '#9fb0c8', marginTop: 8 },
  fail: { color: '#ff8a80', marginTop: 8 },
  ok: { color: '#7ae582', marginTop: 8 },
  run: { color: '#c5d0e6', marginTop: 8 },
  rowButtons: { flexDirection: 'row', gap: 16, marginTop: 12 },
  btn: { color: '#4da3ff', fontSize: 16, fontWeight: '600' },
});
