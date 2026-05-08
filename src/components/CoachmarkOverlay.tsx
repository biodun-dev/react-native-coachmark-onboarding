import * as React from 'react';
import { useContext, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
  Animated,
} from 'react-native';
import {
  CoachmarkContext,
  BackdropBehavior,
  TooltipRenderProps,
} from '../CoachmarkContext';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const BORDER_SIZE = Math.max(SCREEN_HEIGHT, SCREEN_WIDTH);

interface OverlayProps {
  backdropBehavior?: BackdropBehavior;
  overlayColor?: string;
  renderTooltip?: (props: TooltipRenderProps) => React.ReactNode;
}

export const CoachmarkOverlay: React.FC<OverlayProps> = ({
  backdropBehavior = 'none',
  overlayColor = 'rgba(0,0,0,0.7)',
  renderTooltip,
}) => {
  const context = useContext(CoachmarkContext);

  const posX = useRef(new Animated.Value(0)).current;
  const posY = useRef(new Animated.Value(0)).current;
  const spotWidth = useRef(new Animated.Value(0)).current;
  const spotHeight = useRef(new Animated.Value(0)).current;
  const borderRadius = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  if (!context) return null;

  const {
    elements,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    stopSequence,
    isActive,
  } = context;

  const activeElement = Object.values(elements).find(
    (el) => el.step === currentStep
  );

  useEffect(() => {
    if (isActive && activeElement) {
      const { x, y, width, height } = activeElement.layout;
      const pad = activeElement.padding ?? 8;
      const targetRadius =
        activeElement.shape === 'circle'
          ? (Math.max(width, height) + pad * 2) / 2
          : (activeElement.radius ?? 8) + pad;

      Animated.parallel([
        Animated.timing(posX, { toValue: x - pad, duration: 300, useNativeDriver: false }),
        Animated.timing(posY, { toValue: y - pad, duration: 300, useNativeDriver: false }),
        Animated.timing(spotWidth, { toValue: width + pad * 2, duration: 300, useNativeDriver: false }),
        Animated.timing(spotHeight, { toValue: height + pad * 2, duration: 300, useNativeDriver: false }),
        Animated.timing(borderRadius, { toValue: targetRadius, duration: 300, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    }
  }, [isActive, activeElement, posX, posY, spotWidth, spotHeight, borderRadius, opacity]);

  if (!isActive || !activeElement) return null;

  const handleBackdropPress = () => {
    if (backdropBehavior === 'skip') stopSequence();
    else if (backdropBehavior === 'next') nextStep();
  };

  const { y, height } = activeElement.layout;
  const pad = activeElement.padding ?? 8;
  const showAbove = y + height + pad + 160 > SCREEN_HEIGHT;

  const tooltipPositionStyle = showAbove
    ? { bottom: SCREEN_HEIGHT - y + pad + 10 }
    : { top: y + height + pad + 10 };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const tooltipRenderProps: TooltipRenderProps = {
    step: currentStep,
    totalSteps,
    title: activeElement.title,
    description: activeElement.description,
    onNext: nextStep,
    onPrev: prevStep,
    onSkip: stopSequence,
    isFirstStep,
    isLastStep,
  };

  const content = (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.spotlight,
          {
            top: Animated.add(posY, -BORDER_SIZE),
            left: Animated.add(posX, -BORDER_SIZE),
            width: Animated.add(spotWidth, BORDER_SIZE * 2),
            height: Animated.add(spotHeight, BORDER_SIZE * 2),
            borderWidth: BORDER_SIZE,
            borderColor: overlayColor,
            borderRadius: Animated.add(borderRadius, BORDER_SIZE),
            opacity,
          },
        ]}
        pointerEvents="none"
      />

      <Animated.View
        style={[
          styles.tooltip,
          tooltipPositionStyle,
          {
            opacity,
            transform: [{ scale: opacity }],
          },
        ]}
      >
        {renderTooltip ? (
          renderTooltip(tooltipRenderProps)
        ) : (
          <>
            <Text style={styles.stepIndicator}>
              {currentStep + 1} of {totalSteps}
            </Text>

            <Text style={styles.tooltipTitle}>{activeElement.title}</Text>

            {activeElement.description && (
              <Text style={styles.tooltipDesc}>
                {activeElement.description}
              </Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={stopSequence} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>

              <View style={styles.navButtons}>
                {!isFirstStep && (
                  <TouchableOpacity onPress={prevStep} style={styles.prevButton}>
                    <Text style={styles.prevText}>Back</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
                  <Text style={styles.nextText}>
                    {isLastStep ? 'Done' : 'Next'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );

  if (backdropBehavior !== 'none') {
    return (
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        {content}
      </TouchableWithoutFeedback>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  spotlight: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  tooltip: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  stepIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  tooltipDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prevButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E4E8',
  },
  prevText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  nextText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
