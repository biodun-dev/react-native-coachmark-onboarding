import * as React from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  CoachmarkContext,
  CoachmarkElement,
  CoachmarkProviderProps,
} from './CoachmarkContext';
import { CoachmarkOverlay } from './components/CoachmarkOverlay';

export const CoachmarkProvider = ({
  children,
  onFinish,
  onSkip,
  onStepChange,
  backdropBehavior = 'none',
  enabled = true,
  overlayColor,
  renderTooltip,
}: CoachmarkProviderProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [elements, setElements] = useState<Record<string, CoachmarkElement>>({});

  const totalSteps = useMemo(() => {
    const steps = Object.values(elements).map((el) => el.step);
    return steps.length > 0 ? Math.max(...steps) + 1 : 0;
  }, [elements]);

  useEffect(() => {
    if (isActive && totalSteps > 0 && currentStep >= totalSteps) {
      setIsActive(false);
      setCurrentStep(0);
      onFinish?.();
    }
  }, [currentStep, totalSteps, isActive, onFinish]);

  useEffect(() => {
    if (isActive && currentStep < totalSteps) {
      onStepChange?.(currentStep, totalSteps);
    }
  }, [currentStep, isActive, totalSteps, onStepChange]);

  const registerElement = useCallback((element: CoachmarkElement) => {
    setElements((prev: Record<string, CoachmarkElement>) => ({
      ...prev,
      [element.id]: element,
    }));
  }, []);

  const unregisterElement = useCallback((id: string) => {
    setElements((prev: Record<string, CoachmarkElement>) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const startSequence = useCallback(() => {
    if (!enabled) return;
    setIsActive(true);
    setCurrentStep(0);
  }, [enabled]);

  const stopSequence = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    onSkip?.();
  }, [onSkip]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev: number) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev: number) => Math.max(0, prev - 1));
  }, []);

  const value = useMemo(
    () => ({
      isActive,
      currentStep,
      totalSteps,
      elements,
      registerElement,
      unregisterElement,
      startSequence,
      stopSequence,
      nextStep,
      prevStep,
    }),
    [
      isActive,
      currentStep,
      totalSteps,
      elements,
      registerElement,
      unregisterElement,
      startSequence,
      stopSequence,
      nextStep,
      prevStep,
    ]
  );

  return (
    <CoachmarkContext.Provider value={value}>
      {children}
      <CoachmarkOverlay
        backdropBehavior={backdropBehavior}
        overlayColor={overlayColor}
        renderTooltip={renderTooltip}
      />
    </CoachmarkContext.Provider>
  );
};
