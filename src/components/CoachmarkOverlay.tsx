import * as React from 'react';
import { useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming
} from 'react-native-reanimated';
import { CoachmarkContext } from '../CoachmarkContext';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const BORDER_SIZE = Math.max(SCREEN_HEIGHT, SCREEN_WIDTH);

export const CoachmarkOverlay: React.FC = () => {
  const context = useContext(CoachmarkContext);

  const posX = useSharedValue(0);
  const posY = useSharedValue(0);
  const spotWidth = useSharedValue(0);
  const spotHeight = useSharedValue(0);
  const borderRadius = useSharedValue(0);
  const opacity = useSharedValue(0);

  if (!context) return null;

  const { elements, currentStep, nextStep, stopSequence, isActive } = context;
  const activeElement = Object.values(elements).find((el) => el.step === currentStep);

  useEffect(() => {
    if (isActive && activeElement) {
      const { x, y, width, height } = activeElement.layout;
      const targetRadius = activeElement.shape === 'circle' 
        ? Math.max(width, height) / 2 
        : (activeElement.radius ?? 8);

      posX.value = withTiming(x);
      posY.value = withTiming(y);
      spotWidth.value = withTiming(width);
      spotHeight.value = withTiming(height);
      borderRadius.value = withTiming(targetRadius);
      opacity.value = withTiming(1);
    } else {
      opacity.value = withTiming(0);
    }
  }, [isActive, activeElement, posX, posY, spotWidth, spotHeight, borderRadius, opacity]);

  if (!isActive || !activeElement) return null;

  const animatedSpotlightStyle = useAnimatedStyle(() => {
    return {
      top: posY.value - BORDER_SIZE,
      left: posX.value - BORDER_SIZE,
      width: spotWidth.value + BORDER_SIZE * 2,
      height: spotHeight.value + BORDER_SIZE * 2,
      borderWidth: BORDER_SIZE,
      borderRadius: borderRadius.value + BORDER_SIZE,
      opacity: opacity.value,
    };
  });

  const animatedTooltipStyle = useAnimatedStyle(() => {
    const isTop = posY.value + spotHeight.value + 20 > SCREEN_HEIGHT - 150;
    return {
      position: 'absolute',
      left: 20,
      right: 20,
      [isTop ? 'bottom' : 'top']: isTop 
        ? SCREEN_HEIGHT - posY.value + 10 
        : posY.value + spotHeight.value + 10,
      opacity: opacity.value,
      transform: [{ scale: withTiming(opacity.value) }],
    };
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View 
        style={[styles.spotlight, animatedSpotlightStyle]} 
        pointerEvents="none" 
      />
      
      <Animated.View style={[styles.tooltip, animatedTooltipStyle]}>
        <Text style={styles.tooltipText}>Step {currentStep + 1}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={stopSequence} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  spotlight: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderColor: 'rgba(0,0,0,0.7)',
  },
  tooltip: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  tooltipText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
  },
  skipButton: {
    padding: 8,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  skipText: {
    color: '#666',
    fontWeight: '500',
  },
  nextText: {
    color: 'white',
    fontWeight: '600',
  },
});
