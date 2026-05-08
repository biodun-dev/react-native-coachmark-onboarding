import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CoachmarkProvider, useCoachmark } from 'react-native-coachmark-onboarding';

const CoachmarkTarget = ({
  id,
  step,
  title,
  description,
  children,
  style,
  shape,
  radius,
  padding,
}: {
  id: string;
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  style?: any;
  shape?: 'rect' | 'circle';
  radius?: number;
  padding?: number;
}) => {
  const { ref, onLayout } = useCoachmark(id, step, {
    title,
    description,
    shape,
    radius,
    padding,
  });
  return (
    <View ref={ref} onLayout={onLayout} style={style} collapsable={false}>
      {children}
    </View>
  );
};

const MainScreen = () => {
  const { startSequence } = useCoachmark('trigger', -1, {
    title: 'Trigger',
  });

  return (
    <SafeAreaView style={styles.container}>
      <CoachmarkTarget
        id="header"
        step={0}
        title="Welcome Header"
        description="This is the main header area. It shows the title of the current screen."
        radius={4}
        padding={4}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Coachmark Demo</Text>
          <Text style={styles.headerSubtext}>Tap below to start the tour</Text>
        </View>
      </CoachmarkTarget>

      <View style={styles.content}>
        <CoachmarkTarget
          id="card"
          step={1}
          title="Feature Card"
          description="Cards display your key content. This one showcases the smooth spotlight transitions between steps."
          radius={16}
          padding={8}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Animated Spotlight</Text>
            <Text style={styles.cardDesc}>
              Watch the spotlight smoothly morph as it moves between elements
              with different shapes and sizes.
            </Text>
          </View>
        </CoachmarkTarget>

        <CoachmarkTarget
          id="stats"
          step={2}
          title="Statistics Panel"
          description="This panel shows key metrics. Notice how the spotlight adapts to wider elements."
          radius={12}
          padding={6}
        >
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Shapes</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>99</Text>
              <Text style={styles.statLabel}>Options</Text>
            </View>
          </View>
        </CoachmarkTarget>

        <TouchableOpacity style={styles.startButton} onPress={startSequence}>
          <Text style={styles.startButtonText}>Start Walkthrough</Text>
        </TouchableOpacity>
      </View>

      <CoachmarkTarget
        id="fab"
        step={3}
        title="Action Button"
        description="This floating button uses a circular spotlight. Perfect for round elements!"
        shape="circle"
        padding={8}
      >
        <View style={styles.fab}>
          <Text style={styles.fabIcon}>+</Text>
        </View>
      </CoachmarkTarget>
    </SafeAreaView>
  );
};

export default function App() {
  const [tourCompleted, setTourCompleted] = useState(false);

  return (
    <SafeAreaProvider>
      <CoachmarkProvider
        enabled={!tourCompleted}
        backdropBehavior="next"
        onFinish={() => {
          setTourCompleted(true);
          Alert.alert('🎉 Tour Complete!', 'You have finished the walkthrough.');
        }}
        onSkip={() => {
          setTourCompleted(true);
        }}
        onStepChange={(step, total) => {
          console.log(`Step ${step + 1} of ${total}`);
        }}
      >
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
  headerSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
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
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 16,
    padding: 16,
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  startButton: {
    marginTop: 32,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
