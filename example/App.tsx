import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CoachmarkProvider, useCoachmark } from 'react-native-coachmark-onboarding';

const CoachmarkTarget = ({ 
  id, 
  step, 
  children, 
  style, 
  shape, 
  radius 
}: { 
  id: string, 
  step: number, 
  children: React.ReactNode, 
  style?: any,
  shape?: 'rect' | 'circle',
  radius?: number
}) => {
  const { ref, onLayout } = useCoachmark(id, step, { shape, radius });
  return (
    <View ref={ref} onLayout={onLayout} style={style}>
      {children}
    </View>
  );
};

const MainScreen = () => {
  const { startSequence } = useCoachmark('trigger', -1);

  return (
    <SafeAreaView style={styles.container}>
      <CoachmarkTarget id="header" step={0} style={styles.headerContainer} radius={4}>
        <Text style={styles.headerText}>Welcome to Coachmark</Text>
      </CoachmarkTarget>

      <View style={styles.content}>
        <CoachmarkTarget id="card" step={1} style={styles.card} radius={16}>
          <Text style={styles.cardTitle}>Animated Morphing</Text>
          <Text style={styles.cardDesc}>Watch the spotlight smoothly transition from a rectangle to a circle!</Text>
        </CoachmarkTarget>

        <TouchableOpacity style={styles.startButton} onPress={startSequence}>
          <Text style={styles.startButtonText}>Start Animated Walkthrough</Text>
        </TouchableOpacity>
      </View>

      <CoachmarkTarget id="fab" step={2} style={styles.fab} shape="circle">
        <Text style={styles.fabIcon}>+</Text>
      </CoachmarkTarget>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <CoachmarkProvider>
        <MainScreen />
      </CoachmarkProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    padding: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E4E8',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 24,
  },
  startButton: {
    marginTop: 40,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    color: 'white',
    fontSize: 32,
    fontWeight: '300',
  },
});
