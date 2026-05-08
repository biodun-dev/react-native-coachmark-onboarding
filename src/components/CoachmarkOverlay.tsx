import * as React from 'react';
import { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { CoachmarkContext } from '../CoachmarkContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CoachmarkOverlay: React.FC = () => {
  const context = useContext(CoachmarkContext);

  if (!context || !context.isActive) return null;

  const { elements, currentStep, nextStep, stopSequence } = context;
  const activeElement = Object.values(elements).find((el) => el.step === currentStep);

  if (!activeElement) return null;

  const { x, y, width, height } = activeElement.layout;

  const spotlightStyle = {
    top: y - 1000,
    left: x - 1000,
    width: width + 2000,
    height: height + 2000,
    borderWidth: 1000,
    borderColor: 'rgba(0,0,0,0.7)',
    borderRadius: 1008,
  };

  const tooltipPosition = y + height + 20 > SCREEN_HEIGHT - 150 ? 'top' : 'bottom';
  const tooltipStyle = {
    position: 'absolute' as const,
    left: 20,
    right: 20,
    [tooltipPosition === 'top' ? 'bottom' : 'top']: tooltipPosition === 'top' ? SCREEN_HEIGHT - y + 10 : y + height + 10,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <View style={[styles.spotlight, spotlightStyle]} pointerEvents="none" />
      
      <View style={tooltipStyle}>
        <Text style={styles.tooltipText}>Step {currentStep + 1}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={stopSequence} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  spotlight: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  tooltipText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  skipButton: {
    padding: 8,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  skipText: {
    color: '#666',
  },
  nextText: {
    color: 'white',
    fontWeight: '600',
  },
});
