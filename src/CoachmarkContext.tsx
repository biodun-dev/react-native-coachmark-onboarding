import * as React from 'react';
import { createContext, useState, useCallback, useMemo } from 'react';
import { LayoutRectangle } from 'react-native';
import { CoachmarkOverlay } from './components/CoachmarkOverlay';

export interface CoachmarkElement {
  id: string;
  layout: LayoutRectangle;
  step: number;
}

export interface CoachmarkContextType {
  isActive: boolean;
  currentStep: number;
  elements: Record<string, CoachmarkElement>;
  registerElement: (element: CoachmarkElement) => void;
  unregisterElement: (id: string) => void;
  startSequence: () => void;
  stopSequence: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const CoachmarkContext = createContext<CoachmarkContextType | undefined>(undefined);

export const CoachmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [elements, setElements] = useState<Record<string, CoachmarkElement>>({});

  const registerElement = useCallback((element: CoachmarkElement) => {
    setElements((prev: Record<string, CoachmarkElement>) => ({ ...prev, [element.id]: element }));
  }, []);

  const unregisterElement = useCallback((id: string) => {
    setElements((prev: Record<string, CoachmarkElement>) => {
      const newElements = { ...prev };
      delete newElements[id];
      return newElements;
    });
  }, []);

  const startSequence = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
  }, []);

  const stopSequence = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, []);

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
      elements,
      registerElement,
      unregisterElement,
      startSequence,
      stopSequence,
      nextStep,
      prevStep,
    }),
    [isActive, currentStep, elements, registerElement, unregisterElement, startSequence, stopSequence, nextStep, prevStep]
  );

  return (
    <CoachmarkContext.Provider value={value}>
      {children}
      <CoachmarkOverlay />
    </CoachmarkContext.Provider>
  );
};
